# abaaso
abaaso is a RESTful JavaScript framework. Don't know REST? No problem! abaaso extends the prototypes of Array, Element, Number, and String with methods (functions) to make magic possible. Semantic classes & methods (Object Oriented Programming) strive to make anything as easy as saying it!

abaaso is event oriented: on(), fire() and un() is how you register, trigger & unregister listeners. You can see what listeners are registered on something with listeners(), which accepts an optional event parameter.

Application states can be triggered by setting abaaso.state.current.

### REST
Hypermedia As The Engine Of Application State (HATEOAS) can be enabled by setting abaaso.state.header to a custom HTTP header, which triggers stateful binding. Listeners for all states must be set before the initial URI is retrieved (on "init" is ideal). URIs are treated as Objects via String representations. This means the HTTP verbs are available as methods, including jsonp()!

RESTful methods: allows(), permissions() and options().


### API Documention
API documentation is available at http://abaaso.com 


### Example
abaaso namespace is aliased to $, to allow for a nice short syntax:


*$.get(uri, successHandler, failureHandler);* or *uri.get(successHandler, failureHandler)*


The lifecycle of the request will be encased with the implied security of a RESTful architecture (using HTTP headers).


### License
abaaso is licensed under BSD-3 http://www.opensource.org/licenses/BSD-3-Clause

### Copyright
Copyright (c) 2011, Jason Mulligan <jason.mulligan@avoidwork.com>