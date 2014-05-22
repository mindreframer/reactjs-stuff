capacitor
=========

A stream-based alternative to MVC - the gulpjs of web application development. 

# Intro to Capacitor

Capacitor is a small library for composing applications by assembling small, reusable components. You define the named events your application will handle and the processing steps for each. Then, send events in and watch them all get handled. Some benefits:
- enforces complete separation of business logic and UI.
- allows handling of all events - UI events, web sockets, SSEs, devices, etc via the exact same mechanism.
- encourages small units of functionality that can be easily tested.
- makes it easy to ensure that all events are handled.

Capacitor has exactly one concept to learn: streams ([node streams](http://nodejs.org/api/stream.html), to be exact). You compose your application by defining a processing stream for each event you want to process. Each stream is just that - a node stream. Any existing npm library for working with streams plugs right in.

Conceptually, it goes like this:

```
Events -> Capacitor maps to stream -> log pipe -> API pipe -> DOM Renderer pipe -> (done)
```
    
Events come into the system, are routed to handlers. Handlers are pipelines of `capacitors` that sequentially process each event or `current`. 

The code for the above:

```javascript
var Capacitor = require('capacitor'),
    log = require('capacitor-log'),
    // ...;

var flux = new Capacitor();
flux.circuit('someEvent', function() {
  return 
    // log incoming events
    this.pipe(log())
    
    // take the event data {user: ..., password: ...}
    // and HTTP POST it to /api/my/endpoint
    // httpPost() will **replace** the event data with the result
    .pipe(httpPost('/api/my/endpoint'))

    // render 'templateName' using the event data
    // and set that html as the innerHTML of domEl
    .pipe(domRender('templateName', domEl))
});
    
flux.generate('someEvent', {user: 'capacitor', password: 'flux'});

// processing pipeline:
// => log {user: 'capacitor', password: 'flux'}
// => post {user: 'capacitor', password: 'flux'} to /api/my/endpoint 
//    (returns eg {success: true, name: 'Fux Capacitor'})
//    event data is replaced with the http response
// => render 'templateName' using {success: true, name: 'Fux Capacitor'} at domEl
```

# Inspiration

We've written applications using traditional MVC frameworks that take in substantial amounts of $$$. While those frameworks are good (AngularJS in particular), we wanted a system that has the following properties:

- **Simple**. Few concepts, systematically applied, without leaky abstractions.
- **Testable**. Simple components mean it's easy to write tests and verify functionality.
- **All events are equal**. Events from web sockets or devices need to be handled identically to UI events.
- **Powerful event handling**. Lots of pub/sub items ping-ponging events around is the new spaghetti code. We need a powerful framework for routing all events and making sure each is handled appropriately.
- **Composable**. Mix and match the best available libraries to suit your purposes. Know that anything following a basic pattern (any node stream) will plug in and work.

In summary, we wanted this:

![Event Flow](https://github.com/capacitorjs/capacitor/raw/master/capacitorjs-flow-diagram.png)

# Similar Work

We started development of capacitor about a month ago. Then, we watched Facebook's talk ["Hacker Way: Rethinking Web App Development at Facebook"](https://www.youtube.com/watch?v=nYkdrAPrdcw&feature=youtu.be) and knew that we were on to something. 

Capacitor takes inspiration from the following:
- [React/Flux](http://facebook.github.io/react/blog/2014/05/06/flux.html) from Facebook
- [gulpjs](http://gulpjs.com/)'s use of stream processing
- Functional Reactive Programming - in particular [RxJS](https://github.com/Reactive-Extensions/RxJS) and [baconjs](https://github.com/baconjs/bacon.js/tree/master)

# Best Served With

Capacitor works well with [React](http://facebook.github.io/react/) but is not coupled to it. React is particularly useful with Capacitor because it follows the one-way data flow model. Capacitor pushes data into React. React events circle back to Capacitor. Linear data flow FTW.


# Usage

```javascript
// require the library
var Capacitor = require('capacitor');
// require any capacitors that you want to use (~ plugins - these are any node through streams)
var log = require('capacitor-log');

//create instance
var flux = new Capacitor();

// add a named 'circuit' to handle 'sampleEvent' events
flux.circuit('sampleEvent', function() {
  // `this` is an object stream of `Current`s - pipe it to a log stream and return.
  return this.pipe(log());
});

// emit an event into the system
flux.generate('sampleEvent', {
  name: 'Flux Capacitor'
});

// => `{name: 'Flux Capacitor'}` is logged

```

# Development Flow

Start the watcher to rebuild:

    npm start

Run the dev server to host static example files:

    npm run server

Run the tests:

    # continual run:
    npm run watch-test
    # one-time:
    npm test

## License

The MIT License (MIT)

Copyright (c) 2014 Joseph Savona

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.