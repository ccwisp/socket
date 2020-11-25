const auth = require('../auth');
const { client, chatters } = require('../redis');
const User = require('chatdb-picsart-hw').User;
const Message = require('chatdb-picsart-hw').Message;

const onJoin = async (io, socket) => {
  return socket.on('join', async (token, callback) => {
    const userId = await auth(token);
    const currentUser = await User.query().findById(userId);
    const login = currentUser.login;

    // Check whether current user is already online

    if (chatters.indexOf(login) === -1) {
      chatters.push(login);
      client.set('chat_users', JSON.stringify(chatters));
    }
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
      users: chatters, // await User.query().whereNotNull('socket_id'),
    });

    // Getting message history with corresponding senders
    const messages = await Message.query()
      .select('login', 'sender_id', 'body')
      .joinRelated('owner');

    messages.forEach(async message => {
      console.log(message);
      const payload = { user: message.login, text: message.body };
      io.emit('message', payload);
    });

    callback();
  });
};
module.exports = onJoin;
