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
    transport.log('info', 'test info message', { some: 'thing' }, callback);

    expect(client.trackTrace.mock.calls).toHaveLength(1);
    expect(client.trackTrace.mock.calls[0][0]).toEqual({
      message: 'INFO: test info message',
      properties: {
        level: 'info',
        some: 'thing',
        applicationName: 'unit tests',
      },
    });
  });

  it('then it should log warn as trace', () => {
    transport.log('warn', 'test warn message', { some: 'thing' }, callback);

    expect(client.trackTrace.mock.calls).toHaveLength(1);
    expect(client.trackTrace.mock.calls[0][0]).toEqual({
      message: 'WARN: test warn message',
      properties: {
        level: 'warn',
        some: 'thing',
        applicationName: 'unit tests',
      },
    });
  });

  it('then it should log error as exception', () => {
    transport.log('error', 'test error message', { some: 'thing' }, callback);

    expect(client.trackException.mock.calls).toHaveLength(1);
    expect(client.trackException.mock.calls[0][0]).toEqual({
      exception: new Error('test error message'),
      properties: {
        level: 'error',
        some: 'thing',
        applicationName: 'unit tests',
      },
    });
  });

  it('then it should call callback', () => {
    transport.log('info', 'test info message', { some: 'thing' }, callback);

    expect(callback.mock.calls).toHaveLength(1);
  });

  it('then it should call callback with error if error thrown from trace', () => {
    client.trackTrace.mockImplementation(() => {
      throw new Error('test');
    });

    transport.log('info', 'test info message', { some: 'thing' }, callback);

    expect(callback.mock.calls).toHaveLength(1);
    expect(callback.mock.calls[0][0]).not.toBeNull();
    expect(callback.mock.calls[0][0].message).toBe('test');
  });

  it('then it should call callback with error if error thrown from exception', () => {
    client.trackException.mockImplementation(() => {
      throw new Error('test');
    });

    transport.log('error', 'test error message', { some: 'thing' }, callback);

    expect(callback.mock.calls).toHaveLength(1);
    expect(callback.mock.calls[0][0]).not.toBeNull();
    expect(callback.mock.calls[0][0].message).toBe('test');
  });
});
