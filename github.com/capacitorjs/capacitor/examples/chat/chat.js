var Capacitor = require('../..'),
    react = require('capacitor-react'),
    log = require('capacitor-log'),
    through = require('through2'),
    ChatComponent = require('./chat_component'),
    MessageStore = require('./message_store'),
    messageStore,
    messageStoreCapacitor,
    logCapacitor,
    reactCapacitor,

// this is our main event manager aka Capacitor
flux = new Capacitor();

// watch for errors
flux.on(Capacitor.events.ERROR, function(err) {
  console.warn('error: ', err.stack || err.message || err);
});

// message store: can push messages in and they will be stored
messageStore = new MessageStore();
messageStoreCapacitor = messageStore.sender;


// view layer: events processing will end with updating the DOM via React library
reactCapacitor = react.bind(react, ChatComponent, {
  rootEl: document.getElementById('react-container'),
  defaults: {
    messages: [],
    sendMessage: flux.generate.bind(flux, 'send')
  }
});

// an initial event to bootstrap the app, view in particular
flux.circuit('initialize', function() {
  return this.pipe(log())
    // TODO: why does this throw an invariant error even though the event is on 'send' circuit?
    .pipe(reactCapacitor())
});

// handle new messages arriving - either via the UI or anything
// received from the server on websocket
flux.circuit('send', function() {
  return this.pipe(log())
    .pipe(messageStoreCapacitor)
    .pipe(through.obj(function(current, enc, callback) {
      current.data = {
        messages: messageStore.messages
      };
      this.push(current);
      callback();
    }))
    .pipe(reactCapacitor())
});

// manually kick-off rendering with the initialize event we declared above
flux.generate('initialize', {});

// create a websocket instance and pipe its data into flux
var shoe = require('shoe'),
    stream = shoe('/chat');

stream.pipe(through(function(msg, enc, callback) {
  flux.generate('send', String(msg));
  callback();
}))//.pipe(stream);
