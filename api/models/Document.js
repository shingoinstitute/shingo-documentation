/**
 * Document.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require('node-uuid');

module.exports = {

  attributes: {
    uuid:{
      type: 'string',
      unique: true,
      required: true,
      primaryKey: true,
      defaultsTo: function(){
        return uuid.v4();
      }
    },
    title: {
      type: 'string',
      required: true,
      unique: true
    },
    shortDescription: {
      type: 'text',
      required: true
    },
    content: {
      type: 'text'
    },
    project: {
      model: 'project',
      required: true
    },
    methods: {
      collection: 'method',
      via: 'document'
    },
    tags: {
      collection: 'tag',
      via: 'documents'
    }
  }
};
