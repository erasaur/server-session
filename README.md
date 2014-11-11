Meteor Server Session
=====================

This is a repackaging of Matteo's [meteor-server-session](https://github.com/matteodem/meteor-server-session) package, with several key differences. Namely:

- Sessions are unique to each connection
- Sessions are automatically removed when the client closes the connection
- Sessions can only be set from server, but can be read from client or server

##API
Naturally, the API is identical to that of Meteor ServerSession, except that `set` can only be called from the server.

```javascript
ServerSession.set(key, value); // server only!
ServerSession.get(key);
ServerSession.equals(key, expected, identical = true);
```

Defining a condition to check before setting a value:
```javascript
ServerSession.setCondition(function (key, value)); // Should only be invoked on the server
```

##Use Case
A potential use-case for this package is handling one-time API requests. For instance, you could use the ServerSession to store access tokens (e.g from a server-side route) that expire after the connection is closed. This is especially useful if you are using your Meteor app as an external service for other websites.

##Notes
- Meteor's connection close event doesn't fire when server-side code initiates a hot code reload, so the collection in which the sessions are stored (serversession) might accumulate some dead sessions. This shouldn't happen in production though.
- This package was made with the intent of learning in mind. Be forewarned that the implementation or use-cases here may not be ideal.

##License
MIT, like the original package