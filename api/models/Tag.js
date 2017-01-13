/**
 * Tag.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require('node-uuid');

module.exports = {

  attributes: {
    uuid:{
      type: 'string',
      required: true,
      primaryKey: true,
      defaultsTo: function(){
        return uuid.v4();
      }
    },
    label: {
      type: 'string',
      required: true,
      unique: true
    },
    projects: {
      collection: 'project',
      via: 'tags',
      dominant: true
    },
    documents: {
      collection: 'document',
      via: 'tags',
      dominant: true
    },
    methods: {
      collection: 'method',
      via: 'tags',
      dominant: true
    }
  }
};
