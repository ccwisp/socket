const auth = require('../auth');
const User = require('@ccwisp/chatdb').User;
const Message = require('@ccwisp/chatdb').Message;

const onSendMessage = async (io, socket) => {
  return socket.on('sendMessage', async (message, token, callback) => {
    const id = await auth(token);
    const user = await User.query().findById(id);
    const messagePayload = {
      body: message,
      sender_id: id,
    };
    // Inserting message to db

    io.emit('message', { user: user.login, text: message });
    await Message.query().insert(messagePayload);

    callback();
  });
};

module.exports = onSendMessage;
