'use strict';

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String, 
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }, 
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
});

noteSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    ret.id = ret._id; 
    delete ret._id; // delete `_id`
    delete ret.__v;
  }
});

noteSchema.set('timestamps', true);
// Add `createdAt` and `updatedAt` fields
const note = mongoose.model('Note', noteSchema);

module.exports = note; 