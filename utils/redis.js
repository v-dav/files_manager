const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('connect', () => {
      console.log('Redis client connected to the server');
    });

    this.client.on('error', (error) => {
      console.log('Redis client not connected to the server:', error);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    try {
      if (!key) {
        throw new Error('Missing key');
      }

      if (typeof key !== 'string') {
        throw new Error('Key is not a string');
      }
      const value = await this.getAsync(key);
      return value;
    } catch (err) {
      console.error('Error', err.message);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      if (!key || !value || !duration) {
        throw new Error('Missing arguments');
      }

      if (typeof key !== 'string' || typeof value !== 'string' || typeof duration !== 'number') {
        throw new Error('Wrong argument type');
      }

      if (duration <= 0) {
        throw new Error('Wrong duration');
      }

      await this.client.setex(key, duration, value);

      console.log('Key set successfully');
    } catch (err) {
      console.error('Error:', err.message);
    }
  }

  async del(key) {
    try {
      if (!key) {
        throw new Error('Missing key');
      }

      if (typeof key !== 'string') {
        throw new Error('Key is not a string');
      }

      this.client.del(key);
    } catch (err) {
      console.error('Error', err.message);
    }
  }
}

module.exports = RedisClient;
