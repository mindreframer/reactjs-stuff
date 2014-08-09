# react-capacitor

Flux store, and dispatcher.

## Example Usage

```js
npm install react-capacitor

...

// Or in packagae

"react-capacitor": "~0.0.3",
```

```js
var Dispatcher = require('react-capacitor/lib/Dispatcher');
var AppDispatcher = new Dispatcher();
```

###Trigger an action in the view

```js
AppDispatcher.triggerAction('signup', {
  email: 'emmett.brown@1985.com',
  name: 'Emmett'
});
```

###Binding to actions

```js
AppDispatcher.onAction('signup', function(data) {
  UserStore.set('email', data.email);
  UserStore.set('name', data.name);
  UserStore.emit('change');
});
```

### Create a store and set the default

```js
var Store = require('react-capacitor/lib/Store');

var UserStore = new Store({
  email: '',
  name: ''
});
```

###Managing the store

```js
UserStore.set('email', 'marty.mcfly@1985.com');

UserStore.reset();

UserStore.emit('change');
```

###Gettting store data

```js
UserStore.get('email');

UserStore.getAll();
```

###Binding to change events on a React component

```js
...

  componentWillUnmount: function() {
    UserStore.on('change', this._change);
  },

  componentWillUnmount: function() {
    UserStore.removeListener('change', this._change);
  },

...
```
