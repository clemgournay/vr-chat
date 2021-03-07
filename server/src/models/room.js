const bcrypt = require('bcrypt-nodejs');
const config = require('../config');

const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

const RoomSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name id is required']
  },
  creator: {
    type: ObjectId,
    require: [true, 'Creator id is required']
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  hasPassword: {
    type: Boolean,
    default: false
  },
  password: {
    type: String
  }
});
config.SALT_ROUNDS = bcrypt.genSaltSync(parseInt(config.SALT_ROUNDS));
RoomSchema.pre('save', function(next) {
  var room = this;

  if (!room.isModified('password') || room.password == '') return next();
    bcrypt.hash(room.password, config.SALT_ROUNDS, null, function(err, hash) {
      if (err) return next(err);
      room.password = hash;
      next();
    });
});

RoomSchema.pre('findOneAndUpdate', function (next) {
  this._update.password = bcrypt.hashSync(this._update.password, config.SALT_ROUNDS);
  next();
});

RoomSchema.methods.comparePassword = async function(candidatePassword, cb) {
  var self = this;
  bcrypt.compare(candidatePassword, self.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


module.exports = mongoose.model('Room', RoomSchema, 'rooms');
