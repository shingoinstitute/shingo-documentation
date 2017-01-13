/**
 * Method.js
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
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    signature: {
      type: 'string'
    },
    parameters: {
      type: 'string'
    },
    returnValue: {
      type: 'string'
    },
    shortDescription: {
      type: 'string'
    },
    deprecated: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },
    content: {
      type: 'text',
      required: true
    },
    document: {
      model: 'document',
      required: true
    },
    tags: {
      collection: 'tag',
      via: 'methods'
    }
  }
};
