const client = require('./aiClientMock')();
const AppInsightsTransport = require('./../lib');

describe('when logging as trace', () => {
  beforeEach(() => {
    client.mockResetAll();
  });

  it('then it should throw InvalidOptsError if neither client or key are specified', () => {
    try {
      new AppInsightsTransport({});
      throw new Error('no error thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(AppInsightsTransport.InvalidOptsError);
      expect(e.message).toBe('Must specify key or client in opts');
      expect(e.code).toBe('INVALID_OPTS');
      expect(e.key).toBe('key');
    }
  });
});
