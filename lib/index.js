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

    this.name = opts.name || 'AppInsights';
    this.applicationName = opts.applicationName;

    if (opts.client) {
      this._client = opts.client;
    } else if (opts.key) {
      ai.setup(opts.key).start();
      this._client = ai.defaultClient;
    } else {
      throw new InvalidOptsError('Must specify key or client in opts', 'key');
    }

    if (opts.type && opts.type.toLowerCase() === 'event') {
      this._writeLog = (client, level, name, message, meta, applicationName) => {
        client.trackEvent({
          name: name,
          properties: Object.assign({ level, applicationName, message }, meta),
        });
      };
    } else {
      this._writeLog = (client, level, name, message, meta, applicationName) => {
        client.trackTrace({
          message: `${level.toUpperCase()}- ${name}: ${message}`,
          properties: Object.assign({ level, applicationName }, meta),
        });
      };
    }

    if (opts.treatErrorsAsExceptions) {
      this._writeError = (client, level, name, message, meta, applicationName) => {
        client.trackException({
          exception: new Error(message),
          properties: Object.assign({ level, applicationName, name }, meta),
        });
      };
    } else {
      this._writeError = this._writeLog;
    }
  }


  log(payload, callback) {
    
    const {level, name, message, meta} = payload;
    console.log(level);
    console.log(name);
    console.log(message);
    console.log(meta);
    try {
      if (level.toLowerCase() === 'error') {
        this._writeError(this._client, level, name, message, meta, this.applicationName);
      } else {
        this._writeLog(this._client, level, name, message, meta, this.applicationName);
      }
      callback();
    } catch (e) {
      console.log(e);
      callback(e);
    }
  }
}

module.exports = AppInsightsTransport;
module.exports.InvalidOptsError = InvalidOptsError;
