(function() {
  "use strict";

  jest.autoMockOff();

  describe('Dispatcher', function() {
    var Dispatcher = require('../lib/Dispatcher');
    var dispatcher;

    beforeEach(function() {
      dispatcher = new Dispatcher();
    });

    it('sends actions to registered callbacks', function() {

      var listener = jest.genMockFunction();
      dispatcher.register(listener);

      var payload = {};

      dispatcher.dispatch(payload);
      expect(listener.mock.calls.length).toBe(1);
      expect(listener.mock.calls[0][0]).toBe(payload);
    });

    it('can subsribe to events', function() {
      var listener = jest.genMockFunction();
      dispatcher.onAction('foo', listener);

      var data = {};

      dispatcher.triggerAction('foo', data);
      expect(listener.mock.calls.length).toBe(1);
      expect(listener.mock.calls[0][0]).toBe(data);
    });
  });
})();
