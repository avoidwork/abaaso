# abaaso
abaaso is a RESTful JavaScript framework. Don't know REST? No problem! abaaso makes magic possible, with semantic classes & methods (Object Oriented Programming). If you want to do something, it's as easy as saying it!

abaaso extends the prototypes of Array, Element, Number, and String with methods (functions).


### Example
The abaaso namespace is aliased to the $, to allow for a nice short syntax:


*$.get(uri, successHandler, failureHandler);* or *uri.get(successHandler, failureHandler)*


The lifecycle of the request will be encased by the implied security of a RESTful architecture. This type of architecture is  built into HTTP 1.1, and when done properly, is simple to maintain and scales very well (it uses headers!).


### REST
Hypermedia As The Engine Of Application State (HATEOAS) can be enabled by setting abaaso.state.header to a custom HTTP header, which triggers stateful binding. Listeners for all states must be set before the initial URI is retrieved.

URIs are treated as Objects via String representations. This means the HTTP verbs are available as methods, including jsonp()!


### API Documention
API documentation is available at http://abaaso.com 


### License
abaaso is licensed under BSD-3 http://www.opensource.org/licenses/BSD-3-Clause

### Copyright
Copyright (c) 2011, Jason Mulligan <jason.mulligan@avoidwork.com>