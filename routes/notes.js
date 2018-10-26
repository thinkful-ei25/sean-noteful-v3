'use strict';

const express = require('express');

const router = express.Router();
const Note = require('../models/note');
const mongoose = require('mongoose'); 

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;  
  let filter = {};

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter.$or = [{ 'title': re }, { 'content': re }];
  }
  
  Note.find(filter)
    //.sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      return next(err); 
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  return Note.findById(id)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      return next(err); 
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {id} = req.params;  
  const newNote = {
    title: req.body.title,
    content: req.body.content
  };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
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
    content : req.body.content
  }; 


  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  Note.findOneAndUpdate({_id : id}, {$set : newNote}) 
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
