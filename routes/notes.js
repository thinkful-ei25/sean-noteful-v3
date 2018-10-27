'use strict';

const express = require('express');

const router = express.Router();
const Note = require('../models/note');
const Tag = require('../models/tag'); 
const mongoose = require('mongoose'); 

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { folderId, tagId, searchTerm} = req.query; 

  let filter = {};

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'ig');
    filter.$or = [{ 'title': re }, { 'content': re }];
  }

  if (folderId){ 
    filter.folderId = folderId; 
  }

  if (tagId){ 
    filter.tags = tagId; 
  }

  Note.find(filter)
    .populate('tags')
    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      return next(err); 
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const {id} = req.params; 

  return Note.findById(id)
    .populate('tags')
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      return next(err); 
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title, content, folderId, tags} = req.body; 

  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  const newNote = {title, content, folderId, tags}; 

  Note.create(newNote)
    .then(result => {
      res
        .location(`/api/notes/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      return next(err); 
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const {id} = req.params; 

  const newArg = {new :true}; 
  
  const update = {}; 
  const updateableField = ['title', 'content', 'folderId', 'tags']; 

  updateableField.forEach(field => { 
    if (req.body[field]){ 
      update[field] = req.body[field]; 
    }
  }); 

  if (!update.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (update.folderId && !mongoose.Types.ObjectId.isValid(update.folderId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if(update.folderId === '') { 
    delete update.folderId; 
    update.$unset = {folderId : 1}; 
  }

  Note.findByIdAndUpdate(id, update, newArg) 
    .then((result) => { 
      if (result)
        res.status(204).json(result); 
      else 
        return next(); 
    })
    .catch(err => { 
      return next(err); 
    }); 
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  const id = req.params.id; 

  return Note.findByIdAndRemove(id) 
    .then(() => { 
      res.status(204).end();
    })
    .catch(err => { 
      return next(err); 
    }); 
});

module.exports = router;
