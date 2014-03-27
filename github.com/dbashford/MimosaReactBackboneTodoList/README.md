Mimosa + React + Backbone + Require.js + Bower
===========================

This is a [Mimosa](http://mimosa.io) skeleton/starter Todo app.  This project integrates:

* React
* Backbone
* Require.js
* Bower

The project also includes:

* An Express server...
* with Jade templates
* single command optimization with r.js including minification and concatenation
* full jshinting.

All with 1 line of config.

Based on the [react-backbone](http://todomvc.com/labs/architecture-examples/react-backbone/) application on [TodoMVC](http://todomvc.com/) from [@petehunt](https://github.com/petehunt/)

## Getting Started

1. `npm install -g mimosa`
2. `git clone https://github.com/dbashford/MimosaReactBackboneTodoList react`
3. `cd react`
4. `mimosa watch --server` or `mimosa watch -s`
5. Open [localhost:3000](http://localhost:3000)

## Optimize the app

1. `mimosa watch --optimize --minify --server` or `mimosa watch -oms`
2. Open [localhost:3000](http://localhost:3000)

Note that the app is now fully minified and concatenated.
