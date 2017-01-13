/**
 * Project.js
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
    description: {
      type: 'text',
      required: true
    },
    repository: {
      type: 'string'
    },
    parent: {
      model: 'project'
    },
    children: {
      collection: 'project',
      via: 'parent'
    },
    documents: {
      collection: 'document',
      via: 'project'
    },
    tags: {
      collection: 'tag',
      via: 'projects'
    }
  }
};
