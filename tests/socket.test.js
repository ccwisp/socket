/* eslint-disable no-undef */
const io = require('socket.io-client');
const ioBack = require('../src/index');
const http = require('http');

let socket;
let httpServer;
let httpServerAddr;
let ioServer;

beforeAll(done => {
  httpServer = http.createServer().listen();
  httpServerAddr = httpServer.address();
  ioServer = ioBack(httpServer);
  done();
});

afterAll(done => {
  ioServer.close();
  httpServer.close();
  done();
});

beforeEach(done => {
  // square brackets are used for IPv6
  socket = io.connect(
    `http://[${httpServerAddr.address}]:${httpServerAddr.port}`,
    {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
      transports: ['websocket'],
    },
  );
  socket.on('connect', () => {
    done();
  });
});

afterEach(done => {
  if (socket.connected) {
    socket.disconnect();
  }
  done();
});

describe('basic socket testing', () => {
  it('should communicate', done => {
    ioServer.emit('echo', 'Hello World');
    socket.once('echo', message => {
      expect(message).toBe('Hello World');
      done();
    });
    ioServer.on('connection', mySocket => {
      expect(mySocket).toBeDefined();
    });
  });
  it('should communicate with waiting for socket.io handshakes', done => {
    socket.emit('sendMessage', 'some messages');

    setTimeout(() => {
      // expect smth
      done();
    }, 50);
  });
});
