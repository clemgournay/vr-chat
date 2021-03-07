const User = require('../models/user');
const config = require('../config');
const fs = require('fs');

// Handle index actions
exports.index = (req, res) => {
  User.get((err, users) => {
      if (err) {
          console.log('Error', err);
          res.json({
              status: "error",
              message: err,
          });
      } else {
        console.log('OK', users);
      }
      res.json({
          status: "success",
          message: "users retrieved successfully",
          data: users
      });
  });
};

// Handle create user actions
exports.new = (req, res) => {
  var user = new User();
  user.name = req.body.name ? req.body.name : user.name;
  user.email = req.body.email;
  user.avatar = req.body.avatar;
  user.charsetIMG = req.body.charsetIMG;
// save the user and check for errors
  user.save((err) => {
    if (err) {
      res.json(err);
    } else {
      res.json({
        message: 'New user created!',
        data: user
      });
    }
  });
};

// Handle view user info
exports.view = (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
      if (err) {
          res.send(err);
      }
      else {
        res.json({
            message: 'User details loading..',
            data: user
        });
      }
  });
};

// Handle update user info
exports.update = (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      res.send(err);
    }
    user.name = req.body.name ? req.body.name : user.name;
    user.email = req.body.email ? req.body.email : user.email;
    user.avatar = req.body.avatar ? req.body.avatar : user.avatar;
    user.charsetIMG = req.body.charsetIMG ? req.body.charsetIMG : user.charsetIMG;
    user.canCreate = req.body.canCreate ? req.body.canCreate : user.canCreate;
    // save the user and check for errors
    user.save((err) => {
      if (err) {
          res.json(err);
      } else {
        res.json({
            message: 'user Info updated',
            data: user
        });
      }
    });
  });
};

exports.findUser = (id) => {
  return new Promise((resolve, reject) => {
    User.findById(id, (error, data) => {
      if(error) {
        resolve({notFound: 'empty'});
      }
      resolve(data);
    });
  })
}

// Handle delete user
exports.delete = (req, res) => {
  User.remove({
    _id: req.params.user_id
  }, (err, user) => {
    if (err) {
        res.send(err);
    } else {
      res.json({
        status: "success",
        message: 'user deleted'
      });
    }
  });
};