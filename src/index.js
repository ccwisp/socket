require('dotenv').config();
const socket = require('socket.io');
const http = require('http');
const server = http.createServer().listen(process.env.PORT);
const io = socket(server);

const Knex = require('knex');
const { Model } = require('objection');
const knexConfig = require('chatdb-picsart-hw').knexfile;

const knex = Knex(knexConfig.development);
Model.knex(knex);

const onJoin = require('./handlers/onJoin');
const onDisconnect = require('./handlers/onDisconnect');
const onSendMessage = require('./handlers/onSendMessage');
const onCommunication = require('./handlers/onCommunication');

io.on('connect', socket => {
  socket.emit('server ready', { msg: 'ready' });

  onCommunication(io, socket);

  onJoin(io, socket);

  onSendMessage(io, socket);

  onDisconnect(io, socket);
});
io.on('disconnect', socket => {
  onDisconnect(io, socket);
});

module.exports = socket;
