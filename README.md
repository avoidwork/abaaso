# abaaso
abaaso is a RESTful JavaScript framework. Don't know REST? No problem! abaaso extends the prototypes of Array, Element, Number, and String with methods (functions) to make magic possible. Semantic classes & methods (Object Oriented Programming) strive to make anything as easy as saying it!

abaaso is event oriented: on(), fire() and un() is how you register, trigger & unregister listeners. You can see what listeners are registered on something with listeners(), which accepts an optional event parameter.

Application states can be triggered by setting abaaso.state.current.

### Representational State Transfer
Hypermedia As The Engine Of Application State (HATEOAS) can be enabled by setting abaaso.state.header to a custom HTTP header, which triggers stateful binding. Listeners for all states must be set before the initial URI is retrieved (on "init" is ideal). URIs are treated as Objects via String representations, so the HTTP verbs are available as methods, including jsonp()!

REST related methods: allows(), permissions() and headers()


### API Documention
API documentation is available at http://abaaso.com 


### Example
abaaso namespace is aliased to $, to allow for a nice short syntax:


*$.get(uri, successHandler, failureHandler);* or *uri.get(successHandler, failureHandler)*


The lifecycle of the request will be encased with the implied security of a RESTful architecture (using HTTP headers).


### Features

* Automatic RESTful XHR / AJAX!
* Hypermedia As The Engine Of Application State (HATEOAS) with a user defined HTTP header
* Object Oriented Programming with classes, methods and chaining
* Semantic classes & methods, easy to read and easy to say out loud
* Helper function $() with DOM selectors
* Advanced event handling with multiple Application States
* Deep Setting with define()
* Namespace is available on $


### What is Supported?

All standards compliant browsers and platforms such as Desktops, Tablets, Smartphones, Google TV, and more!

* Microsoft Internet Explorer 8+ (Standards Mode)
* Google Chrome 6+
* Mozilla FireFox 3.6+
* Apple Safari 5+
* Opera 9+
* Apple iPhone / iPod Touch / iPad
* Google Android


#### License
abaaso is licensed under BSD-3 http://www.opensource.org/licenses/BSD-3-Clause

#### Copyright
Copyright (c) 2010 - 2012, Jason Mulligan <jason.mulligan@avoidwork.com>