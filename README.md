# abaaso

abaaso is a RESTful JavaScript framework. Hypermedia As The Engine Of Application State (HATEOAS) can be enabled by setting abaaso.state.header to a custom HTTP header, which triggers stateful binding.

Listeners for all states must be set before the initial URI is retrieved.

The abaaso namespace is aliased to the $, to allow for a nice short syntax: $.get(uri, successHandler, failureHandler);


### API Documention
API documentation is available at http://abaaso.com 


### License
abaaso is licensed under BSD-3 http://www.opensource.org/licenses/BSD-3-Clause

### Copyright
Copyright (c) 2011, Jason Mulligan <jason.mulligan@avoidwork.com>