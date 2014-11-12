if (Meteor.isServer) {
  Tinytest.add('ServerSession - set', function (test) {
    test.isUndefined(ServerSession.setCondition(function () {
      return true;
    }));
    
    test.throws(function () {
      ServerSession.set();
    }, Error, 'Expected key and value when using set');

    test.isUndefined(ServerSession.set('key', 'value'));
    test.equal('value', ServerSession.get('key'), 'Expected value to match ServerSession value');

    ServerSession.set('key');
    test.isTrue(ServerSession.get('key') === undefined || ServerSession.get('key') === null, 'Expected ServerSession to be undefined');
  });  
}

Tinytest.add('ServerSession - get', function (test) {
  if (Meteor.isServer) {
    ServerSession.set('null', null);
    ServerSession.set('bool', true);
    ServerSession.set('integer', 123);
    ServerSession.set('string', 'wow');
    ServerSession.set('array', [1, 2, 3, ['4', '5', '6', [12, 23, 34]]]);
    ServerSession.set('object', { 'keyA': 'valueA', 'keyB': { 'a': ['b', 'c'] } })  
  }

  test.equal(null, ServerSession.get('null'));
  test.equal(true, ServerSession.get('bool'));
  test.equal(123, ServerSession.get('integer'));
  test.equal('wow', ServerSession.get('string'));
  test.equal([1, 2, 3, ['4', '5', '6', [12, 23, 34]]], ServerSession.get('array'));
  test.equal({ 'keyA': 'valueA', 'keyB': { 'a': ['b', 'c'] } }, ServerSession.get('object'));
});

Tinytest.add('ServerSession - equals (identical)', function (test) {
  if (Meteor.isServer) {
    ServerSession.set('nullB', null);
    ServerSession.set('boolB', true);
    ServerSession.set('integerB', 123);
    ServerSession.set('arrayB', [1, 2, 3, ['4', '5', '6', [11, 12, 31]]]);
    ServerSession.set('emptyObj', {});
    ServerSession.set('emptyArray', []);

    ServerSession.set('stringB', 'not what you expect');
    ServerSession.set('objectB', { 'key': 'wups! not value' });    
  }

  test.isTrue(ServerSession.equals('nullB', null));
  test.isTrue(ServerSession.equals('boolB', true));
  test.isTrue(ServerSession.equals('integerB', 123));
  test.isTrue(ServerSession.equals('arrayB', [1, 2, 3, ['4', '5', '6', [11, 12, 31]]]));
  test.isTrue(ServerSession.equals('emptyObj', {}));
  test.isTrue(ServerSession.equals('emptyArray', []));

  test.isFalse(ServerSession.equals('emptyObj', []));
  test.isFalse(ServerSession.equals('emptyArray', {}));
  test.isFalse(ServerSession.equals('stringB', 'wow'));
  test.isFalse(ServerSession.equals('arrayB', [1, 2, 3, ['4', '5', '6', [11, 12, 30]]]));
  test.isFalse(ServerSession.equals('objectB', { 'key': 'value' }));
});

Tinytest.add('ServerSession - equals (not identical)', function (test) {
  if (Meteor.isServer) {
    ServerSession.set('nullC', null);
    ServerSession.set('boolC', true);
    ServerSession.set('integerC', 1);
    ServerSession.set('stringC', 'wow');  
  }

  test.isTrue(ServerSession.equals('nullC', undefined, false));
  test.isTrue(ServerSession.equals('boolC', !null, false));
  test.isTrue(ServerSession.equals('integerC', true, false));
  test.isFalse(ServerSession.equals('stringC', 'much wow', false));
});

if (Meteor.isServer) {
  Tinytest.add('ServerSession - conditions', function (test) {
    test.isUndefined(ServerSession.setCondition(function () {
      return false;
    }));

    test.throws(function () {
      ServerSession.set('keyB', { foo: 'bar' });
    }, Meteor.Error);

    test.isFalse(ServerSession.equals('keyB', { foo: 'bar' }));

    // also test with return true
    test.isUndefined(ServerSession.setCondition(function () {
      return true;
    }));
    
    ServerSession.set('keyC', { foo: 'bar' });
    test.equal('bar', ServerSession.get('keyC').foo);
    ServerSession.set('keyC', undefined);
  });
}

Tinytest.add('ServerSession - disconnected', function (test) {
  if (Meteor.isClient) {
    Meteor.disconnect();
  }

  if (Meteor.isServer) {
    Meteor.onConnection(function (connection) {
      connection.onClose(function () {
        ServerSession.set('keyD', 'value');
        testDisconnected();
      });
    });
  }
  function testDisconnected () {
    test.isTrue(ServerSession.get('keyD') === undefined || ServerSession.get('keyD') === null, 'Expected ServerSession to be undefined');
  }
});