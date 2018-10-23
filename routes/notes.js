'use strict';

const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const Note = require('../models/note');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const searchTerm = 'cats';
  let filter = {};

  if (searchTerm) {
    filter.title = { $regex: searchTerm };
  }
  //filter = {$or([{ title: searchTerm }, { content: searchTerm }]);

  Note.find(filter)
    .sort({ updatedAt: 'desc' })
    .then(results => {
      console.log('what\'s up yo');
      console.log(results);
      res.json({ results });
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
  const newNote = {
    title: req.body.title,
    content: req.body.content
  };
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
  Note.findOneAndUpdate({_id : id}, {$set : newNote}) 
    .then(() => { 
      res.status(204).end(); 
    })
    .catch(err => { 
      next(err); 
      console.error(`ERROR RUN!!! ${err}`);
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
