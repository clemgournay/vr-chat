const config = require('./config');

module.exports = (server) => {

  const io = require('socket.io')(server, {
    cors: {
      origin: config.APP_DOMAIN,
      methods: ['GET', 'POST']
    }
  });
  const users = {};

  io.on('connection', (socket) => {
    console.log('a user connected');

    users[socket.id] = {ID: socket.id, position: {x: 0, y: 10, z: 0}};

    io.emit('users', users);
    socket.broadcast.emit('new user', users[socket.id]);

    socket.on('user position', (position) => {
      users[socket.id].position = position;
      socket.broadcast.emit('receive position', {ID: socket.id, position: position});
    });
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
      socket.broadcast.emit('user left', socket.id);
      delete users[socket.id];
    });
  });

}