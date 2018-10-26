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

  const id = req.params.id; 
    
  const newNote = { 
    title: req.body.title, 
    content : req.body.content, 
    folderId : req.body.folderId
  }; 

  // if (!mongoose.Types.ObjectId.isValid(newNote.folderId)) {
  //   const err = new Error('The `id` is not valid');
  //   err.status = 400;
  //   return next(err);
  // }

  const newArg = {new :true}; 
  Note.findByIdAndUpdate(id, newNote, newArg) 
    .then(() => { 
      res.status(204).end(); 
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
