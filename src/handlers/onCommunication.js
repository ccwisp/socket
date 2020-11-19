const onCommunication = async (io, socket) => {
  return socket.on('comms', function(content) {
    console.log('Client is ready\n');
    console.log(content);
  });
};
module.exports = onCommunication;
