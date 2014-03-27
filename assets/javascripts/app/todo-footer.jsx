define( [ 'react', './utils' ], function( React, Utils ) {

  var TodoFooter = React.createClass({
    render: function() {
      var activeTodoWord = Utils.pluralize(this.props.count, 'todo');
      var clearButton = null;

      if (this.props.completedCount > 0) {
        clearButton = (
          <button id="clear-completed" onClick={this.props.onClearCompleted}>
            Clear completed ({this.props.completedCount})
          </button>
        );
      }

      return (
        <footer id="footer">
          <span id="todo-count">
            <strong>{this.props.count}</strong>{' '}
            {activeTodoWord}{' '}left
          </span>
          {clearButton}
        </footer>
      );
    }
  });

  return TodoFooter;

});
