// Generated by CoffeeScript 1.7.1
var ReactTagsPlugin, escapedTag, react_dom, tagParser,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

react_dom = require('react').DOM;

tagParser = /this\.([\w|_]*)\(/g;

escapedTag = /[\w]*_$/;

module.exports = ReactTagsPlugin = (function() {
  ReactTagsPlugin.prototype.brunchPlugin = true;

  ReactTagsPlugin.prototype.type = 'javascript';

  ReactTagsPlugin.prototype.pattern = /\.js|\.coffee/;

  function ReactTagsPlugin(config) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    this.config = config;
    this.filter = ((_ref = this.config) != null ? (_ref1 = _ref.plugins) != null ? (_ref2 = _ref1.reactTags) != null ? _ref2.fileFilter : void 0 : void 0 : void 0) || /^(app|test)/;
    this.blacklist = ((_ref3 = this.config) != null ? (_ref4 = _ref3.plugins) != null ? (_ref5 = _ref4.reactTags) != null ? _ref5.blacklist : void 0 : void 0 : void 0) || 'object data map var'.split(' ');
    this.verbose = ((_ref6 = this.config) != null ? (_ref7 = _ref6.plugins) != null ? (_ref8 = _ref7.reactTags) != null ? _ref8.verbose : void 0 : void 0 : void 0) || false;
  }

  ReactTagsPlugin.prototype.compile = function(params, callback) {
    var blacklist, err, output, source, taglist;
    source = params.data;
    if (!this.filter.test(params.path)) {
      return callback(null, {
        data: source
      });
    }
    try {
      blacklist = this.blacklist;
      taglist = [];
      output = source.replace(tagParser, function(fragment, tag) {
        var shortTag;
        if (__indexOf.call(blacklist, tag) >= 0) {
          return fragment;
        }
        if (escapedTag.test(tag)) {
          shortTag = tag.substring(0, tag.length - 1);
          if (__indexOf.call(blacklist, shortTag) >= 0) {
            if (__indexOf.call(taglist, shortTag) < 0) {
              taglist.push(shortTag);
            }
            return "React.DOM." + shortTag + "(";
          }
        }
        if (react_dom.hasOwnProperty(tag)) {
          if (__indexOf.call(taglist, tag) < 0) {
            taglist.push(tag);
          }
          return "React.DOM." + tag + "(";
        }
        return fragment;
      });
    } catch (_error) {
      err = _error;
      if (this.verbose) {
        console.log("ERROR", err);
      }
      return callback(err.toString());
    }
    if (this.verbose && taglist.length > 0) {
      console.log(" - " + params.path + ": " + (taglist.sort().join(', ')));
    }
    return callback(null, {
      data: output
    });
  };

  return ReactTagsPlugin;

})();