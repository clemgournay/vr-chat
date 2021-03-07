
const Room = require('../models/room');
const config = require('../config');

exports.create = function(req, res) {
  if(!config.ENV === 'local' && (!req.body.name || !req.user._id)) {
    res.status(400);
    res.json({message: 'Bad Request'});
  } else {
    let hasPassword = false;
    let password = '';
    if(req.body.password) {
      hasPassword = true;
      password = req.body.password.trim();
    }
    const userID = (config.ENV === 'local') ? req.body.userID : req.user._id;
    Room.create({name: req.body.name.trim(), creator: userID, hasPassword: hasPassword, password: password}, function(error, data) {
      if(error) {
        res.status(500);
        res.json({message: error.message});
      } else {
        res.status(201);
        res.json({
          message: 'New room created!',
          data: data
        })
      }
    });

  }
}

exports.get = function (req, res) {
  const id = req.params.id;
  Room.findById(id, 'name creator hasPassword create_date', function(error, data) {
    if(error) {
      res.status(404).json({message: 'Room not found'});
    }
    res.status(200);
    res.json({
      message: 'Room details',
      data: data
    });
  });
}
exports.getAll = function (req, res) {
  Room.find(null, 'name creator hasPassword create_date',function(error, data) {
    if(error) {
      res.status(404).json({message: 'Rooms not found'});
    } else {
      res.status(200);
      res.json({
        message: 'All rooms',
        data: data
      });
    }
    
  });
}

exports.update = (req, res) => {
  if(!req.params.id) {
    res.status(400).json({message: 'Bad Request'});
  } else {
    Room.findById(req.params.id, (err, room) => {
      if (err) {
        res.send(err);
      }
      room.name = (req.body.name) ? req.body.name : room.name;
      room.hasPassword = req.body.hasPassword ? req.body.hasPassword : room.hasPassword;
      room.save((err) => {
        if (err) {
          res.json(err);
      } else {
          res.status(200);
          res.json({
            message: 'Room info updated',
            data: data
          });
        }
      });
    });
  }
}

exports.delete = function (req, res) {
  if(!req.params.id) {
    res.status(400).json({message: 'Bad Request'});
  } else {
    Room.findByIdAndRemove(req.params.id, function(error, data) {
      if(error || !data) {
        res.status(404).json({message: 'Room not found'});
      } else {
        res.status(200);
        res.json({
          message: 'Room deleted'
        });
      }
    });
  }
}

exports.findRoom = function (room) {
  return new Promise((resolve, reject) => {
    Room.findById(room, function(error, data) {
      if(error) {
        resolve({notFound: 'empty'});
      }
      resolve(data);
    });
  })
}

exports.password = function (req, res) {
  if(!req.params.password || !req.params.id) {
    res.status(400).json({message: 'Bad Request'});
  } else {
    Room.findById(req.params.id, function(error, data) {
      if (error) {
        res.json({
          error: error
        });
      } else {
        data.comparePassword(req.params.password, function(error, isMatch) {
          if (error) {
            res.json({
              error: error
            });
          }
          res.json({isMatch: isMatch});
        });
      }
      
    });
  }
}