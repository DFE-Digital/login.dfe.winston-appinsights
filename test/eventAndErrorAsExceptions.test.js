const client = require('./aiClientMock')();
const { level } = require('winston');
const AppInsightsTransport = require('../lib/index');

const callback = jest.fn();

describe('when logging as trace', () => {
  let transport;
  let payload;
  beforeEach(() => {
    client.mockResetAll();

    callback.mockReset();
    payload = {
      level: 'info', name: 'test event name', message: 'test info message', meta: { some: 'thing' },
    };
    transport = new AppInsightsTransport({
      client,
      type: 'event',
      treatErrorsAsExceptions: true,
      applicationName: 'unit tests',
    });
  });

  it('then it should log info as event', () => {
    transport.log(payload, callback);

    expect(client.trackEvent.mock.calls).toHaveLength(1);
    expect(client.trackEvent.mock.calls[0][0]).toEqual({
      name: 'test event name',
      properties: {
        level: 'info',
        message: 'test info message',
        some: 'thing',
        applicationName: 'unit tests',
        name: 'test event name',
      },
    });
  });

  it('then it should log warn as event', () => {
    payload.level = 'warn';
    payload.message = 'test warn message';
    transport.log(payload, callback);

    expect(client.trackEvent.mock.calls).toHaveLength(1);
    expect(client.trackEvent.mock.calls[0][0]).toEqual({
      name: 'test event name',
      properties: {
        level: 'warn',
        message: 'test warn message',
        some: 'thing',
        applicationName: 'unit tests',
        name: 'test event name',
      },
    });
  });

  it('then it should log error as exception', () => {
    payload.level = 'error';
    payload.message = 'test error message';
    transport.log(payload, callback);

    expect(client.trackException.mock.calls).toHaveLength(1);
    expect(client.trackException.mock.calls[0][0]).toEqual({
      exception: new Error('test error message'),
      properties: {
        level: 'error',
        some: 'thing',
        applicationName: 'unit tests',
        name: 'test event name',
      },
    });
  });

  it('then it should call callback', () => {
    transport.log(payload, callback);

    expect(callback.mock.calls).toHaveLength(1);
  });

  it('then it should call callback with error if error thrown from event', () => {
    client.trackEvent.mockImplementation(() => {
      throw new Error('test');
    });

    transport.log(payload, callback);

    expect(callback.mock.calls).toHaveLength(1);
    expect(callback.mock.calls[0][0]).not.toBeNull();
    expect(callback.mock.calls[0][0].message).toBe('test');
  });

  it('then it should call callback with error if error thrown from exception', () => {
    client.trackException.mockImplementation(() => {
      throw new Error('test');
    });
    payload.level = 'error';
    transport.log(payload, callback);

    expect(callback.mock.calls).toHaveLength(1);
    expect(callback.mock.calls[0][0]).not.toBeNull();
    expect(callback.mock.calls[0][0].message).toBe('test');
  });
});
