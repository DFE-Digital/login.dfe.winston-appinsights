const { maskEmail } = require('../lib/utils/maskEmail');
const AppInsightsTransport = require('../lib/index');

jest.mock('../lib/utils/maskEmail');

describe('AppInsightsTransport _maskEmailProcessor', () => {
  let transport;

  beforeEach(() => {
    maskEmail.mockImplementation(() => 'j******e@email.com');

    transport = new AppInsightsTransport({
      client: {
        addTelemetryProcessor: jest.fn(),
      },
    });
  });

  it('should mask email addresses found in requestData.name field', () => {
    const envelope = {
      data: {
        baseType: 'RequestData',
        baseData: {
          name: 'GET /users/john.doe@email.com',
        },
      },
    };

    transport.maskEmailProcessor(envelope);

    expect(envelope.data.baseData.name).toBe('GET /users/j******e@email.com');
  });

  it('should mask email addresses found in requestData.url field', () => {
    const envelope = {
      data: {
        baseType: 'RequestData',
        baseData: {
          url: 'http://example.com/users/john.doe@email.com',
        },
      },
    };

    transport.maskEmailProcessor(envelope);

    expect(envelope.data.baseData.url).toBe('http://example.com/users/j******e@email.com');
  });

  it('should mask email addresses found in operation name tag', () => {
    const envelope = {
      data: {
        baseType: 'RequestData',
        baseData: {},
      },
      tags: {
        'ai.operation.name': 'GET /users/john.doe@email.com',
      },
    };

    transport.maskEmailProcessor(envelope);

    expect(envelope.tags['ai.operation.name']).toBe('GET /users/j******e@email.com');
  });
});
