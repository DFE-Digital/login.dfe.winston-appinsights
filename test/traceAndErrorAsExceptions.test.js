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
      treatErrorsAsExceptions: true,
      applicationName: 'unit tests',
    });
  });

  it('then it should log info as trace', () => {
    transport.log({level: 'info', name: 'test event name', message: 'test info message', meta:{ some: 'thing' }}, callback);

    expect(client.trackTrace.mock.calls).toHaveLength(1);
    expect(client.trackTrace.mock.calls[0][0]).toEqual({
      message: 'INFO- test event name: test info message',
      properties: {
        level: 'info',
        some: 'thing',
        applicationName: 'unit tests',
      },
    });
  });

  it('then it should log warn as trace', () => {
    transport.log({level: 'warn', name: 'test event warn', message: 'test warn message', meta:{ some: 'thing' }}, callback);

    expect(client.trackTrace.mock.calls).toHaveLength(1);
    expect(client.trackTrace.mock.calls[0][0]).toEqual({
      message: 'WARN- test event warn: test warn message',
      properties: {
        level: 'warn',
        some: 'thing',
        applicationName: 'unit tests',
      },
    });
  });

  it('then it should log error as exception', () => {
    transport.log({level: 'error', name: 'test event error', message: 'test error message', meta:{ some: 'thing' }}, callback);
    expect(client.trackException.mock.calls).toHaveLength(1);
    expect(client.trackException.mock.calls[0][0]).toEqual({
      exception: new Error('test error message'),
      properties: {
        level: 'error',
        some: 'thing',
        applicationName: 'unit tests',
        name: 'test event error',
      },
    });
  });

  it('then it should call callback', () => {
    transport.log({level: 'info', name: 'test event name', message: 'test info message', meta:{ some: 'thing' }}, callback);

    expect(callback.mock.calls).toHaveLength(1);
  });

  it('then it should call callback with error if error thrown from trace', () => {
    client.trackTrace.mockImplementation(() => {
      throw new Error('test');
    });

    transport.log({level: 'info', name: 'test event name', message: 'test info message', meta:{ some: 'thing' }}, callback);

    expect(callback.mock.calls).toHaveLength(1);
    expect(callback.mock.calls[0][0]).not.toBeNull();
    expect(callback.mock.calls[0][0].message).toBe('test');
  });

  it('then it should call callback with error if error thrown from exception', () => {
    client.trackException.mockImplementation(() => {
      throw new Error('test');
    });

    transport.log({level: 'error', name: 'test event error', message: 'test error message', meta:{ some: 'thing' }}, callback);

    expect(callback.mock.calls).toHaveLength(1);
    expect(callback.mock.calls[0][0]).not.toBeNull();
    expect(callback.mock.calls[0][0].message).toBe('test');
  });
});
