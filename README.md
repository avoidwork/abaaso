# abaaso

abaaso is a RESTful JavaScript framework. Hypermedia As The Engine Of Application State (HATEOAS) can be enabled by setting abaaso.state.header to a custom HTTP header.

Listeners for all states must be set before the initial URI is retrieved.

The abaaso namespace is aliased to the $, to allow for a nice short syntax:
$.get("uri", successHandler)

## API Documention
The API documentation is available at http://abaaso.com

## License
abaaso is licensed under BSD-3, so it is possible to include in your open source, or propriatary project.

Copyright (c) 2011, Jason Mulligan <jason.mulligan@avoidwork.com>