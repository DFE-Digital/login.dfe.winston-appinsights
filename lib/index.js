const Transport = require('winston-transport');
const ai = require('applicationinsights');

class InvalidOptsError extends Error {
  constructor(message, key) {
    super(message);

    this.code = 'INVALID_OPTS';
    this.key = key;
  }
}

class AppInsightsTransport extends Transport {
  constructor(opts) {
    super(opts);

    if (opts.client) {
      this._client = opts.client;
    } else if (opts.key) {
      ai.setup(opts.key).start();
      this._client = ai.defaultClient;
    } else {
      throw new InvalidOptsError('Must specify key or client in opts', 'key');
    }

    if (opts.type && opts.type.toLowerCase() === 'event') {
      this._writeLog = (client, level, message, meta) => {
        client.trackEvent({
          name: message,
          properties: Object.assign({ level, message }, meta),
        });
      };
    } else {
      this._writeLog = (client, level, message, meta) => {
        client.trackTrace({
          message: `${level.toUpperCase()}: ${message}`,
          properties: Object.assign({ level }, meta),
        });
      };
    }

    if (opts.treatErrorsAsExceptions) {
      this._writeError = (client, level, message, meta) => {
        client.trackException({
          exception: new Error(message),
          properties: Object.assign({ level }, meta),
        });
      };
    } else {
      this._writeError = this._writeLog;
    }
  }

  log(level, message, meta, callback) {
    try {
      if (level.toLowerCase() === 'error') {
        this._writeError(this._client, level, message, meta);
      } else {
        this._writeLog(this._client, level, message, meta);
      }
      callback();
    } catch (e) {
      callback(e);
    }
  }
}

module.exports = AppInsightsTransport;
module.exports.InvalidOptsError = InvalidOptsError;
