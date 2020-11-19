const auth = require('../auth');
const User = require('@ccwisp/chatdb').User;
const Message = require('@ccwisp/chatdb').Message;

const onJoin = async (io, socket) => {
  return socket.on('join', async (token, callback) => {
    const userId = await auth(token);
    const currentUser = await User.query().findById(userId);
    const login = currentUser.login;

    // Check whether current user is already online
    if (currentUser.socket_id === null) {
      await User.query()
        .findById(userId)
        .patch({ socket_id: socket.id });

      socket.emit('message', {
        user: 'Administrator',
        text: `${login}, welcome !`,
      });
    }
    io.emit('data', {
      users: await User.query().whereNotNull('socket_id'),
    });

    // Getting message history with corresponding senders
    const messages = await Message.query()
      .select('body', 'sender_id', 'login')
      .joinRelated('owner');

    messages.forEach(async message => {
      const payload = { user: message.login, text: message.body };
      io.emit('message', payload);
    });

    callback();
  });
};
module.exports = onJoin;
