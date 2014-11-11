Package.describe({
  name: 'erasaur:server-session',
  summary: 'Meteor Server-side Sessions, similar to the typical Client Session',
  version: '0.0.0',
  git: 'https://github.com/erasaur/server-session'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.addFiles('erasaur:server-session.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('erasaur:server-session');
  api.addFiles('erasaur:server-session-tests.js');
});
