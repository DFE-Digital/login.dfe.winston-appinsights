jest.mock('applicationinsights');

const client = require('./aiClientMock')();
const ai = require('applicationinsights');
const AppInsightsTransport = require('./../lib');

const callback = jest.fn();
const aiStart = jest.fn();

describe('when configuring transport to using AI key', () => {
  beforeEach(() => {
    client.mockResetAll();

    aiStart.mockReset();
    ai.setup.mockReset().mockReturnValue({ start: aiStart });
    ai.defaultClient = client;
  });

  it('then it should setup ai with specified key', () => {
    new AppInsightsTransport({
      key: 'some-ai-key',
      applicationName: 'unit tests',
    });

    expect(ai.setup.mock.calls).toHaveLength(1);
    expect(ai.setup.mock.calls[0][0]).toBe('some-ai-key');
  });

  it('then it should start ai', () => {
    new AppInsightsTransport({
      key: 'some-ai-key',
      applicationName: 'unit tests',
    });

    expect(aiStart.mock.calls).toHaveLength(1);
  });

  it('then it should use ai default client as client for trace', () => {
    const transport = new AppInsightsTransport({
      key: 'some-ai-key',
      applicationName: 'unit tests',
    });
    transport.log({level: 'info', name: 'event name test', message: 'test info message', meta: { some: 'thing' }}, callback);


    expect(client.trackTrace.mock.calls).toHaveLength(1);
  });

  it('then it should use ai default client as client for event', () => {
    const transport = new AppInsightsTransport({
      key: 'some-ai-key',
      type: 'event',
      applicationName: 'unit tests',
    });
    transport.log({level: 'info', name: 'event name test', message: 'test info message', meta: { some: 'thing' }}, callback);


    expect(client.trackEvent.mock.calls).toHaveLength(1);
  });

  it('then it should use ai default client as client for exception', () => {
    const transport = new AppInsightsTransport({
      key: 'some-ai-key',
      treatErrorsAsExceptions: true,
      applicationName: 'unit tests',
    });
    transport.log({level: 'error', name: 'test event error', message: 'test error message', meta:{ some: 'thing' }}, callback);

    expect(client.trackException.mock.calls).toHaveLength(1);
  });
});
