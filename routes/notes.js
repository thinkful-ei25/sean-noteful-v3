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

  Note
    .find(filter)
    .sort({ updatedAt: 'desc' })
    .then(results => {
      console.log('what\'s up yo');
      console.log(results);
      res.json({results});
    })
    .then(() => {
      //return mongoose.disconnect();
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  //console.log('Get a Note');
  //res.json({ id: 1, title: 'Temp 1' });
  const id = req.params.id; 
  return Note.findById(id) 
    .then(result => { 
      res.json(result); 
    })
    .then(() => { 
      //return mongoose.disconnect(); 
    })
    .catch(err => { 
      console.error(`ERROR RUN!!! ${err}`);
    }); 
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  console.log('Create a Note');
  res
    .location('path/to/new/document')
    .status(201)
    .json({ id: 2, title: 'Temp 2' });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  console.log('Update a Note');
  res.json({ id: 1, title: 'Updated Temp 1' });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  console.log('Delete a Note');
  res.status(204).end();
});

module.exports = router;
