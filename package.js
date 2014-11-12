Package.describe({
  name: 'erasaur:server-session',
  summary: 'Meteor Server-side Sessions, similar to the typical Client Session',
  version: '0.0.1',
  git: 'https://github.com/erasaur/server-session'
});

Package.onUse(function (api) {
  api.versionsFrom('1.0');

  api.use([
    'underscore', 
    'ddp', 
    'mongo'
  ], [ 'client', 'server' ]);

  api.export('ServerSession');

  api.addFiles('lib/server-session.js', [
    'client', 'server'
  ]);
});

Package.onTest(function (api) {
  api.use([
    'erasaur:server-session', 
    'tinytest', 
    'test-helpers'
  ]);
  
  api.addFiles('tests/server-session-tests.js', [
    'client', 'server'
  ]);
});
