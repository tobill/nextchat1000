var Redis = require('ioredis');
const client = Redis();

module.exports = {
  client: client
};
