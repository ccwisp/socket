const User = require('chatdb-picsart-hw').User;

const onDisconnect = async (io, socket) => {
  return socket.on('disconnect', async () => {
    const user = await User.query().findOne({
      socket_id: socket.id,
    });

    const login = user.login;

    socket.broadcast.emit('message', {
      user: 'Administrator',
      text: `${login} has left.`,
    });
    await User.query()
      .findOne({ socket_id: socket.id })
      .patch({ socket_id: null });

    io.emit('data', {
      users: await User.query().whereNotNull('socket_id'),
    });
  });
};

module.exports = onDisconnect;
