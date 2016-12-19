/**
 * Games.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    game: {
      type: 'text',
      required: true
    },
    image:{
      type: 'text',
      required: true,
      defaultsTo: 'images/missing.png'
    },
    rating: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },
    description: {
      type: 'text',
      required: true,
      defaultsTo: 'Needs a description'
    },
    isEnabled: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    }
  }

};

