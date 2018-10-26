'use strict';

const mongoose = require('mongoose'); 

const tagSchema = mongoose.Schema({ 
  name: { type: String, required: true }
}); 

tagSchema.set('toJSON', { 
  virtuals: true, 
  transform: (doc, ret) => { 
    delete ret._id; // delete `_id`
    delete ret.__v;
  } 
}); 

tagSchema.set('timestamps', true); 

const tag = mongoose.model('Tag', tagSchema); 

module.exports = tag; 