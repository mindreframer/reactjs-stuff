define( ['react', './utils', './todo-item', './todo-footer'],
function( React, Utils, TodoItem, TodoFooter ) {

  // An example generic Mixin that you can add to any component that should react
  // to changes in a Backbone component. The use cases we've identified thus far
  // are for Collections -- since they trigger a change event whenever any of
  // their constituent items are changed there's no need to reconcile for regular
  // models. One caveat: this relies on getBackboneModels() to always return the
  // same model instances throughout the lifecycle of the component. If you're
  // using this mixin correctly (it should be near the top of your component
  // hierarchy) this should not be an issue.
  var BackboneMixin = {
    componentDidMount: function() {
      // Whenever there may be a change in the Backbone data, trigger a reconcile.
      this.getBackboneModels().forEach(function(model) {
        model.on('add change remove', this.forceUpdate.bind(this, null), this);
      }, this);
    },

    componentWillUnmount: function() {
      // Ensure that we clean up any dangling references when the component is
      // destroyed.
      this.getBackboneModels().forEach(function(model) {
        model.off(null, null, this);
      }, this);
    }
  };

  var TodoApp = React.createClass({
    mixins: [BackboneMixin],
    getInitialState: function() {
      return {editing: null};
    },

    componentDidMount: function() {
      // Additional functionality for todomvc: fetch() the collection on init
      this.props.todos.fetch();
      this.refs.newField.getDOMNode().focus();
    },

    componentDidUpdate: function() {
      // If saving were expensive we'd listen for mutation events on Backbone and
      // do this manually. however, since saving isn't expensive this is an
      // elegant way to keep it reactively up-to-date.
      this.props.todos.forEach(function(todo) {
        todo.save();
      });
    },

    getBackboneModels: function() {
      return [this.props.todos];
    },

    handleSubmit: function(event) {
      event.preventDefault();
      var val = this.refs.newField.getDOMNode().value.trim();
      if (val) {
        this.props.todos.create({
          title: val,
          completed: false,
          order: this.props.todos.nextOrder()
        });
        this.refs.newField.getDOMNode().value = '';
      }
    },

    toggleAll: function(event) {
      var checked = event.nativeEvent.target.checked;
      this.props.todos.forEach(function(todo) {
        todo.set('completed', checked);
      });
    },

    edit: function(todo) {
      this.setState({editing: todo.get('id')});
    },

    save: function(todo, text) {
      todo.set('title', text);
      this.setState({editing: null});
    },

    clearCompleted: function() {
      this.props.todos.completed().forEach(function(todo) {
        todo.destroy();
      });
    },

    render: function() {
      var footer = null;
      var main = null;
      var todoItems = this.props.todos.map(function(todo) {
        return (
          <TodoItem
            key={todo.cid}
            todo={todo}
            onToggle={todo.toggle.bind(todo)}
            onDestroy={todo.destroy.bind(todo)}
            onEdit={this.edit.bind(this, todo)}
            editing={this.state.editing === todo.get('id')}
            onSave={this.save.bind(this, todo)}
          />
        );
      }, this);

      var activeTodoCount = this.props.todos.remaining().length;
      var completedCount = todoItems.length - activeTodoCount;
      if (activeTodoCount || completedCount) {
        footer =
          <TodoFooter
            count={activeTodoCount}
            completedCount={completedCount}
            onClearCompleted={this.clearCompleted}
          />;
      }

      if (todoItems.length) {
        main = (
          <section id="main">
            <input id="toggle-all" type="checkbox" onChange={this.toggleAll} />
            <ul id="todo-list">
              {todoItems}
            </ul>
          </section>
        );
      }

      return (
        <div>
          <section id="todoapp">
            <header id="header">
              <h1>todos</h1>
              <form onSubmit={this.handleSubmit}>
                <input
                  ref="newField"
                  id="new-todo"
                  placeholder="What needs to be done?"
                />
              </form>
            </header>
            {main}
            {footer}
          </section>
          <footer id="info">
            <p>Double-click to edit a todo</p>
            <p>
              Created by{' '}
              <a href="http://github.com/petehunt/">petehunt</a>
            </p>
            <p>
              Mimosa, Bower and RequireJS added by{' '}
              <a href="http://github.com/dbashford/">dbashford</a>
            </p>
          </footer>
        </div>
      );
    }
  });

  return TodoApp;

});
