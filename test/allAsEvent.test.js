const client = require('./aiClientMock')();
const AppInsightsTransport = require('./../lib');

const callback = jest.fn();

describe('when logging as trace', () => {
  let transport;

  beforeEach(() => {
    client.mockResetAll();

    callback.mockReset();

    transport = new AppInsightsTransport({
      client,
      type: 'event',
      applicationName: 'unit tests',
    });
  });

  it('then it should log info as event', () => {
    transport.log('info', 'test info message', { some: 'thing' }, callback);

    expect(client.trackEvent.mock.calls).toHaveLength(1);
    expect(client.trackEvent.mock.calls[0][0]).toEqual({
      name: 'test info message',
      properties: {
        level: 'info',
        message: 'test info message',
        some: 'thing',
        applicationName: 'unit tests',
      },
    });
  });

  it('then it should log warn as event', () => {
    transport.log('warn', 'test warn message', { some: 'thing' }, callback);

    expect(client.trackEvent.mock.calls).toHaveLength(1);
    expect(client.trackEvent.mock.calls[0][0]).toEqual({
      name: 'test warn message',
      properties: {
        level: 'warn',
        message: 'test warn message',
        some: 'thing',
        applicationName: 'unit tests',
      },
    });
  });

  it('then it should log error as event', () => {
    transport.log('error', 'test error message', { some: 'thing' }, callback);

    expect(client.trackEvent.mock.calls).toHaveLength(1);
    expect(client.trackEvent.mock.calls[0][0]).toEqual({
      name: 'test error message',
      properties: {
        level: 'error',
        message: 'test error message',
        some: 'thing',
        applicationName: 'unit tests',
      },
    });
  });

  it('then it should call callback', () => {
    transport.log('info', 'test info message', { some: 'thing' }, callback);

    expect(callback.mock.calls).toHaveLength(1);
  });

  it('then it should call callback with error if error thrown', () => {
    client.trackEvent.mockImplementation(() => {
      throw new Error('test');
    });

    transport.log('info', 'test info message', { some: 'thing' }, callback);

    expect(callback.mock.calls).toHaveLength(1);
    expect(callback.mock.calls[0][0]).not.toBeNull();
    expect(callback.mock.calls[0][0].message).toBe('test');
  });
});
