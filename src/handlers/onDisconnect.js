const User = require('chatdb-picsart-hw').User;
const { client, chatters } = require('../redis');
const onDisconnect = async (io, socket) => {
  return socket.on('disconnect', async () => {
    const user = await User.query().findOne({
      socket_id: socket.id,
    });

    const login = user.login;
    console.log(user);
    socket.broadcast.emit('message', {
      user: 'Administrator',
      text: `${login} has left.`,
    });
    await User.query()
      .findOne({ socket_id: socket.id })
      .patch({ socket_id: null });

    chatters.splice(chatters.indexOf(login), 1);
    client.set('chat_users', JSON.stringify(chatters));

    io.emit('data', {
      users: chatters, // await User.query().whereNotNull('socket_id'),
    });
  });
};

module.exports = onDisconnect;
