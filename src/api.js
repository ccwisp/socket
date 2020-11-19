'use strict';

const fetch = require('cross-fetch');
const { API_ENDPOINT } = require('./config');

const getUserFromDB = async (id, token) => {
  try {
    const res = await fetch(API_ENDPOINT + id, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (res.status >= 400) {
      throw new Error('Bad response from server');
    }

    const user = await res.json();
    return user;
  } catch (err) {
    console.error(err);
  }
};

module.exports = getUserFromDB;
