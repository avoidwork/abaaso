# abaaso

abaaso is a modern, lightweight Enterprise class RESTful JavaScript application framework.

[![build status](https://secure.travis-ci.org/avoidwork/abaaso.png)](http://travis-ci.org/avoidwork/abaaso)

## How is it different?

abaaso gets in front of APIs with `DataStores`, providing a really powerful model which can be displayed with reactive DOM components: `DataLists` & `DataGrids`. It complements UI frameworks by handling the I/O, as well as filtering & sorting the data.

abaaso foregoes MVC in favor of the native OOP design of JavaScript with custom instances, allowing for a clean separation of concerns.

## What is Supported?

All HTML5 compliant browsers and platforms such as Desktops, Tablets, Smartphones, Google TV, and more!

* Microsoft Internet Explorer 9+ (standards mode)
* Google Chrome 6+ / Android 2.3+
* Mozilla FireFox 3.6+
* Apple Safari 5+ / iPhone / iPod Touch / iPad
* AMD loaders (require.js, cujo.js)
* node.js & npm (npm install abaaso)

## Features

* abaaso() for DOM queries & namespace
* API abstraction through DataStores
* Web Workers for "expensive" DataStore ops (if available)
* Automatic RESTful AJAX, avoids "over the wire" requests if possible
* Application state driven by custom HTTP header
* abaaso.sugar() to enable syntactic sugar
* Familiar API
* Evented with a global observer, Elements fire "change" events via `MutationObservers`
* I/O built on Promises/A+
* localStorage or MongoDB for persistent storage

## Support

If you're having problems, use the support forum at CodersClan.

<a href="http://codersclan.net/forum/index.php?repo_id=9"><img src="http://www.codersclan.net/graphics/getSupport_blue_big.png" width="160"></a>

## License
Copyright (c) 2013 Jason Mulligan  
Licensed under the BSD-3 license.