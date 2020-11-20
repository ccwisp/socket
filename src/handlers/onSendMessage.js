const auth = require('../auth');
const User = require('chatdb-picsart-hw').User;
const Message = require('chatdb-picsart-hw').Message;

const onSendMessage = async (io, socket) => {
  return socket.on('sendMessage', async (message, token, callback) => {
    const id = await auth(token);
    const user = await User.query().findById(id);
    const messagePayload = {
      body: message,
      sender_id: id,
    };
    // Inserting message to db
    await Message.query().insert(messagePayload);
    io.emit('message', { user: user.login, text: message });

    callback();
  });
};

module.exports = onSendMessage;
