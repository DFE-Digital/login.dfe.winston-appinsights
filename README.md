# DfE Login Winston Application Insights transport
[![Build Status](https://travis-ci.org/DFE-Digital/login.dfe.winston-appinsights.svg?branch=master)](https://travis-ci.org/DFE-Digital/login.dfe.winston-appinsights)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

Winston transport for Application Insights

# Usage

The transport can be added to Winston as per any other transport:

```
const AITransport = require('login.dfe.winston-appinsights');
const logger = new (winston.Logger)({
  transports: [
    new AITransport({ key: 'YOUR-AI-INSTRUMENTATION-KEY' }),
  ],
});
```

By default messages are logged as traces in Application Insights, in the format `{LEVEL}: {message}`. It will include any metadata as custom properties.

## Providing your own Application Insights client
In the above example, the transport with start it's own application insights instance and use that. If you want to configure Application Insights yourself, you
can provide the client which will be used by the transport.

```
const AITransport = require('login.dfe.winston-appinsights');
const appInsights = require('applicationinsights');

// Do any other setup you want here
appInsights.setup(YOUR-AI-INSTRUMENTATION-KEY).start();

const logger = new (winston.Logger)({
  transports: [
    new AITransport({ client: appInsights.defaultClient }),
  ],
});
```

## Logging errors as exceptions
You can get the transport layer to log any messages at level `error` as exception in Application Insights.

```
const AITransport = require('login.dfe.winston-appinsights');
const logger = new (winston.Logger)({
  transports: [
    new AITransport({ key: 'YOUR-AI-INSTRUMENTATION-KEY', treatErrorsAsExceptions: true }),
  ],
});
```

## Logging as custom events rather than trace
There can be instances where trace items are not suitable. In this case you can change to write messages as custom events. The event name will be the message
and metadata will be included as properties of the event.

```
const AITransport = require('login.dfe.winston-appinsights');
const logger = new (winston.Logger)({
  transports: [
    new AITransport({ key: 'YOUR-AI-INSTRUMENTATION-KEY', type: 'event' }),
  ],
});
```