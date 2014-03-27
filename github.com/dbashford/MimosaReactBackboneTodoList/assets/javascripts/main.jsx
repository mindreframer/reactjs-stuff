require({
  urlArgs: "b=" + ((new Date()).getTime()),
  shim: {
    'jquery': {
      exports: '$'
    }
  },
  paths: {
    react: 'vendor/react/react',
    backbone: 'vendor/backbone/backbone',
    underscore: 'vendor/lodash/lodash.compat',
    bbLocalStorage: 'vendor/backbone.localStorage/backbone.localStorage',
    jquery: 'vendor/zepto/zepto'
  }
}, ['app/app', 'app/todo-list-collection', 'react'],
function( TodoApp, TodoList, React ) {
  React.renderComponent(
    <TodoApp todos={new TodoList()} />, document.getElementById('container')
  );
});
