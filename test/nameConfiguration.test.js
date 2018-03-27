const client = require('./aiClientMock')();
const AppInsightsTransport = require('./../lib');

describe('when configuring name', () => {
  beforeEach(() => {
    client.mockResetAll();
  });

  it('then it should use name from opts', () => {
    const transport = new AppInsightsTransport({ client, name: 'test123' });

    expect(transport.name).toBe('test123');
  });

  it('then it should use AppInsights as name if not specified in opts', () => {
    const transport = new AppInsightsTransport({ client });

    expect(transport.name).toBe('AppInsights');
  });
});
