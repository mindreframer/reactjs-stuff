(function() {
  "use strict";

  jest.autoMockOff();

  describe('Store', function() {
    var ObjectStore = require("../lib/Store.js");
    var objectStore;

    beforeEach(function() {
      objectStore = new ObjectStore({
        foo: 'bar',
        bar: 'foo'
      });
    });

    it('can get a value', function() {
      var foo = objectStore.get('foo');
      expect(foo).toEqual('bar');
    });

    it('can set a value', function() {
      objectStore.set('foo', 'boop');
      var foo = objectStore.get('foo');

      expect(foo).toEqual('boop');
    });

    it('can get all values', function() {
      var all = objectStore.getAll();

      expect(all.foo).toEqual('bar');
      expect(all.bar).toEqual('foo');
    });

    it('can set all values', function() {
      objectStore.setAll({
        foo: 'boop',
        bar: 'beep'
      });
      var all = objectStore.getAll();

      expect(all.foo).toEqual('boop');
      expect(all.bar).toEqual('beep');
    });

    it('can iterate over all store items with forEach', function() {
      var all = {};
      objectStore.forEach(function(key, value) {
        all[key] = value;
      });

      expect(all.foo).toEqual('bar');
      expect(all.bar).toEqual('foo');
    });

    it('can reset defaults', function() {
      objectStore.setAll({
        foo: 'boop',
        bar: 'beep'
      });

      objectStore.reset();
      var all = objectStore.getAll();

      expect(all.foo).toEqual('bar');
      expect(all.bar).toEqual('foo');
    });

    it('resets defaults and does not reference _defaults object', function() {
      objectStore.set('foo', 'boop');
      objectStore.reset();

      objectStore.set('foo', 'boop2');
      objectStore.reset();
      var foo = objectStore.get('foo');

      expect(foo).toEqual('bar');
    });

    it('resets defaults and removes items that were not defaults', function() {
      objectStore.set('alt', 'foo');
      objectStore.reset();
      var foo = objectStore.get('alt');

      expect(foo).toBeUndefined();
    });
  });
}());
