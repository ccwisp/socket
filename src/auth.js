const jwt = require('jsonwebtoken');

const auth = async token => {
  const user = await jwt.verify(token, process.env.SECRET);
  if (!user) throw new Error(400, 'Token is invalid');
  return user.id;
};

module.exports = auth;
