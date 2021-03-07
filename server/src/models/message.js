const mongoose = require('mongoose');

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const messageSchema = mongoose.Schema({
  authorID: {
    type: ObjectId,
    required: true
  },
  roomID: {
    type: ObjectId,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Message', messageSchema, 'messages');
