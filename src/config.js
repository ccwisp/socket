require('dotenv').config({ path: '../.env.dev' });
const config = {
  PORT: process.env.PORT,
  API_ENDPOINT: process.env.API_ENDPOINT,
  SECRET: process.env.SECRET,
};

module.exports = config;
