module.exports = () => ({
  trackEvent: jest.fn(),
  addTelemetryProcessor: jest.fn(),
  trackTrace: jest.fn(),
  trackException: jest.fn(),
  mockResetAll() {
    this.trackEvent.mockReset();
    this.trackTrace.mockReset();
    this.trackException.mockReset();
    this.addTelemetryProcessor.mockReset();
  },
});
