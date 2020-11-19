'use strict';

const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

const auth = async token => {
  const user = await jwt.verify(token, SECRET);
  if (!user) throw new Error(400, 'Token is invalid');
  return user.id;
};

module.exports = auth;
