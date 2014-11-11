ServerSession = (function () {
  'use strict';

  var clientID;
  var Collection = new Mongo.Collection('serversession');
  var checkForKey = function (key) {
    if ("undefined" === typeof key) {
      throw new Error('Please provide a key!');
    }
  };
  var getSessionValue = function (obj, key) {
    return obj && obj.values && obj.values[key];
  };
  var condition = function () {
    return true;
  };

  Collection.allow({
    'insert': function () {
      return false;
    },
    'update' : function () {
      return false;
    },
    'remove': function () {
      return false;
    }
  });

  // public client and server api
  var api = {
    'get': function (key) {
      var sessionObj = Meteor.isServer ? 
        Meteor.call('serversession_get') : Collection.findOne();

      return getSessionValue(sessionObj, key);
    },
    'equals': function (key, expected, identical) {
      var sessionObj = Meteor.isServer ? 
        Meteor.call('serversession_get') : Collection.findOne();

      var value = getSessionValue(sessionObj, key);

      if (_.isObject(value) && _.isObject(expected)) {
        return _(value).isEqual(expected);
      }

      if (false === identical) {
        return expected == value;
      }

      return expected === value;
    }
  };

  if (Meteor.isClient) {
    Meteor.subscribe('serversession');
  }

  if (Meteor.isServer) {
    Meteor.onConnection(function (connection) {
      clientID = connection.id;

      console.log('new connection');

      if (!Collection.findOne({ 'clientID': clientID }))
        Collection.insert({ 'clientID': clientID, 'values': {} });

      connection.onClose(function () {
        console.log('removed connection');
        Collection.remove({ 'clientID': clientID });
      });
    });

    Meteor.publish('serversession', function () {
      return Collection.find({ 'clientID': clientID });
    });

    Meteor.methods({
      'serversession_get': function () {
        if (!clientID)
          return;

        return Collection.findOne({ 'clientID': clientID });
      }
    });  

    // server-only api
    _.extend(api, {
      'set': function (key, value) {
        if (!condition(key, value)) {
          throw new Meteor.Error('Condition failed (has to be specified on server!)');
        }

        if (!clientID)
          return;

        var updateObj = {};
        updateObj['values.' + key] = value;

        Collection.update({ 'clientID': clientID }, { 
          $set: updateObj 
        });
      },
      'setCondition': function (newCondition) {
        condition = newCondition;
      }
    });
  }

  return api;
})();
