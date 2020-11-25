const redis = require('redis');
const client = redis.createClient(
  `rediss://default:${process.env.REDIS_PASS}@db-redis-picsart-chat-do-user-8334901-0.b.db.ondigitalocean.com:25061`,
);

let chatters;
// Redis Client Ready
client.once('ready', function() {
  client.get('chat_users', function(err, reply) {
    if (reply) {
      chatters = JSON.parse(reply);
    }
    if (err) {
      console.error(err);
    }
  });
});

module.exports = { client, chatters };
