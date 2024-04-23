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
      applicationName: 'unit tests',
    });
  });

  it('then it should log info as trace', () => {
    transport.log({level: 'info', name: 'testevent name', message: 'INFO: test info message', meta: { some: 'thing' }}, callback);

    expect(client.trackTrace.mock.calls).toHaveLength(1);
    expect(client.trackTrace.mock.calls[0][0]).toEqual({
      message: 'INFO- testevent name: INFO: test info message',
      properties: {
        level: 'info',
        some: 'thing',
        applicationName: 'unit tests',
        name: 'testevent name',
      },
    });
  });

  it('then it should log warn as trace', () => {
    transport.log({level: 'warn', name: 'event warn name', message: 'test warn message', meta: { some: 'thing' }}, callback);

    expect(client.trackTrace.mock.calls).toHaveLength(1);
    expect(client.trackTrace.mock.calls[0][0]).toEqual({
      message: 'WARN- event warn name: test warn message',
      properties: {
        level: 'warn',
        some: 'thing',
        applicationName: 'unit tests',
        name: 'event warn name',
      },
    });
  });

  it('then it should log error as trace', () => {
    transport.log({ level: 'error', name: 'test error event name', message: 'test error message', meta: { some: 'thing' }}, callback);

    expect(client.trackTrace.mock.calls).toHaveLength(1);
    expect(client.trackTrace.mock.calls[0][0]).toEqual({
      message: 'ERROR- test error event name: test error message',
      properties: {
        level: 'error',
        some: 'thing',
        applicationName: 'unit tests',
        name: 'test error event name',
      },
    });
  });

  it('then it should call callback', () => {
    transport.log({level: 'info', name: 'testevent name', message: 'test info message', meta: { some: 'thing' }}, callback);

    expect(callback.mock.calls).toHaveLength(1);
  });

  it('then it should call callback with error if error thrown', () => {
    client.trackTrace.mockImplementation(() => {
      throw new Error('test');
    });

    transport.log({level: 'info', name: 'test event anem', message: 'test info message', meta: { some: 'thing' }}, callback);

    expect(callback.mock.calls).toHaveLength(1);
    expect(callback.mock.calls[0][0]).not.toBeNull();
    expect(callback.mock.calls[0][0].message).toBe('test');
  });
});
