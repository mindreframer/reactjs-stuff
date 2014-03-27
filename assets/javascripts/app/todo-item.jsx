define( ['react', './utils'], function( React, Utils ) {

  var TodoItem = React.createClass({
    handleSubmit: function(event) {
      var val = this.refs.editField.getDOMNode().value.trim();
      if (val) {
        this.props.onSave(val);
      } else {
        this.props.onDestroy();
      }
      return false;
    },

    onEdit: function() {
      this.props.onEdit();
      this.refs.editField.getDOMNode().focus();
    },

    render: function() {
      var classes = Utils.stringifyObjKeys({
        completed: this.props.todo.get('completed'), editing: this.props.editing
      });
      return (
        <li className={classes}>
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              checked={this.props.todo.get('completed')}
              onChange={this.props.onToggle}
              key={this.props.key}
            />
            <label onDoubleClick={this.onEdit}>
              {this.props.todo.get('title')}
            </label>
            <button className="destroy" onClick={this.props.onDestroy} />
          </div>
          <form onSubmit={this.handleSubmit}>
            <input
              ref="editField"
              className="edit"
              defaultValue={this.props.todo.get('title')}
              onBlur={this.handleSubmit}
              autoFocus="autofocus"
            />
          </form>
        </li>
      );
    }
  });

  return TodoItem;
});
