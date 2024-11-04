/* eslint-disable max-classes-per-file */
const Transport = require('winston-transport');
const ai = require('applicationinsights');
const { maskEmail } = require('./utils/maskEmail');

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

    // Add telemetry processor to mask email in operation name
    this._client.addTelemetryProcessor(this.maskEmailProcessor);

    if (opts.type && opts.type.toLowerCase() === 'event') {
      this._writeLog = (client, level, name, message, meta, applicationName) => {
        client.trackEvent({
          name,
          properties: {
            level, name, applicationName, message, ...meta,
          },
        });
      };
    } else {
      this._writeLog = (client, level, name, message, meta, applicationName) => {
        client.trackTrace({
          message: `${level.toUpperCase()}- ${name}: ${message}`,
          properties: {
            level, name, applicationName, ...meta,
          },
        });
      };
    }

    if (opts.treatErrorsAsExceptions) {
      this._writeError = (client, level, name, message, meta, applicationName) => {
        client.trackException({
          exception: new Error(message),
          properties: {
            level, applicationName, name, ...meta,
          },
        });
      };
    } else {
      this._writeError = this._writeLog;
    }
  }

  /**
   * Processes telemetry envelope data to mask any email addresses
   * found in the request data's name, URL, and operation_Name.
   * This method is intended to prevent sensitive information (such as email
   * addresses) from being sent to Application Insights.
   */
  maskEmailProcessor(envelope) {
    const requestData = envelope.data.baseData;

    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;

    if (requestData.name) {
      requestData.name = requestData.name.replace(emailRegex, maskEmail);
    }
    if (requestData.url) {
      requestData.url = requestData.url.replace(emailRegex, maskEmail);
    }
    if (envelope.tags && envelope.tags['ai.operation.name']) {
      envelope.tags['ai.operation.name'] = envelope.tags['ai.operation.name'].replace(emailRegex, maskEmail);
    }
  }

  log(payload, callback) {
    const {
      level, name, message, meta,
    } = payload;
    try {
      if (level.toLowerCase() === 'error') {
        this._writeError(this._client, level, name, message, meta, this.applicationName);
      } else {
        this._writeLog(this._client, level, name, message, meta, this.applicationName);
      }
      callback();
    } catch (e) {
      callback(e);
    }
  }
}

module.exports = AppInsightsTransport;
module.exports.InvalidOptsError = InvalidOptsError;
