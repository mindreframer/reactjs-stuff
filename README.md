react-unit-test
===============

Sample configuration to unit test a [ReactJS](http://facebook.github.io/react/) application.

The unit tests run in nodejs, without any browser.


The build is based on:
  - [nodejs](http://nodejs.org/) / [npm](https://www.npmjs.org/)
  - [gulp](https://github.com/gulpjs/gulp)
  - [browserify](http://browserify.org/), to write nodejs modules that can be used in the browser
  - [mocha](http://visionmedia.github.io/mocha/), for unit tests
  - [cheerio](http://matthewmueller.github.io/cheerio/) to analyse the produced HTML in the tests
  - [jsdom](https://github.com/tmpvar/jsdom), for testing DOM


### install node modules
```
npm install -D
```

### build, test and watch

```
./node_modules/.bin/gulp
```

### only build

```
./node_modules/.bin/gulp build
```

### only test

```
./node_modules/.bin/gulp test
```

### build for production

```
./node_modules/.bin/gulp build --production
```

### clean
```
./node_modules/.bin/gulp clean
```
