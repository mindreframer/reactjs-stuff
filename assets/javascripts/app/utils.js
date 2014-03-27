define( function() {

  var Utils = {
    pluralize: function( count, word ) {
      return count === 1 ? word : word + 's';
    },

    stringifyObjKeys: function(obj) {
      var s = '';
      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }
        if (obj[key]) {
          s += key + ' ';
        }
      }
      return s;
    }
  };

  return Utils;
});
