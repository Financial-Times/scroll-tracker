
Scroll Tracker
==========

A small library for tracking scroll position as a percentage.

[![Build status][shield-build]](https://circleci.com/gh/Financial-Times/scroll-tracker)

```js
/*
 * Log to the console whenever the document.body element
 * enters one of the defined percentages in `buckets`.
 * Limit logging to happy once every 250ms.
 */
const scrollTracker = new ScrollTracker({
  element: document.body,
  buckets: [10,20,30,40,50,60,70,80,90,100],
  callback: (buckets) => console.log(buckets),
  delay: 250
});

/*
 * Destroy the logging system which was previously set up.
 */
const scrollTracker.destroy();
```


Table of Contents
-----------------

  * [Requirements](#requirements)
  * [Usage](#usage)
  * [Contributing](#contributing)
  * [License](#license)


Requirements
------------

Scroll Tracker is a CommonJS module and available on [npm]. To use within a browser, a bundling tool is required (Browserify/Webpack).

Usage
-----

Scroll Tracker is easiest to use when installed with [npm]:

```sh
npm install scroll-tracker
```

Then you can load the module into your code with a `require` call:

```js
const ScrollTracker = require('scroll-tracker');
```

The `ScrollTracker` variable is a constructor.

### `new ScrollTracker({ element: HTMLElement, buckets: Array[Number...], callback: Function (Array[Number...]), delay: Number})`

Construct a new ScrollTracker instance.

- `element` is the element to track scroll percentage of (_HTMLElement_).
- `buckets` is the set of scroll percentages to track (_Array[Number...]_).
- `callback` is the function to be called when page has scrolled into a bucket (_Function (Array[Number...])_).
- `delay` is the amount of milliseconds to wait between calling the callback (_Number_).

#### Example
```js
/*
 * Log to the console whenever the document.body element
 * enters one of the defined percentages in `buckets`.
 * Limit logging to happy once every 250ms.
 */
const scrollTracker = new ScrollTracker({
  element: document.body,
  buckets: [10,20,30,40,50,60,70,80,90,100],
  callback: (buckets) => console.log(buckets),
  delay: 250
});
```

A `ScrollTracker` instance has the following methods.

### `.destroy()`

Destroy a ScrollTracker instance, removing all event listeners added during construction of the instance.

#### Example
```js
/*
 * Destroy the logging system which was previously set up.
 */
const scrollTracker.destroy();
```

Contributing
------------

To contribute to Scroll Tracker, clone this repo locally and commit your code on a separate branch. Please write unit tests for your code, and run the linter before opening a pull-request:

```sh
npm test  # run all unit tests
npm run lint  # run the linter
```

License
-------

Scroll Tracker is licensed under the MIT license.


[node]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[shield-build]: https://circleci.com/gh/Financial-Times/scroll-tracker.svg?style=svg
[weakmap]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/WeakMap#Browser_compatibility
