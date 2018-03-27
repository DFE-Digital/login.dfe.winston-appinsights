module.exports = () => {
  return {
    trackEvent: jest.fn(),
    trackTrace: jest.fn(),
    trackException: jest.fn(),
    mockResetAll: function() {
      this.trackEvent.mockReset();
      this.trackTrace.mockReset();
      this.trackException.mockReset();
    },
  };
};