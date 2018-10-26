'use strict';

const express = require('express');
const router = express.Router();

const Tag = require('../models/tag');
const Note = require('../models/note'); 

const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  Tag.find()
    .sort({name : 1})
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      return next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  
  Tag.findById(id)
    .then(result => {
      res
        .status(200)
        .json(result);
    })
    .catch(err => {
      res.status(400); 
      return next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  
  const {name} = req.body; 
  const newItem = {name}; 
  const newArg = {new :true}; 

  if(!name) { 
    const err = new Error('Missing `name` in request body'); 
    err.status = 400; 
    return next(err); 
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findByIdAndUpdate(id, newItem, newArg)
    .then((result) => {
      res.status(204).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      res.status(400); 
      return next(err);
    });
});

router.post('/', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const newTag = { name };

  if(!name) { 
    const err = new Error('Missing `name` in request body'); 
    err.status = 400; 
    return next(err); 
  }

  Tag.create(newTag)
    .then(result => {
      Note.$pull({ tagId : newTag.id}); 
      res
        .location(`/api/tags/${id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      return next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Tag.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      return next(err);
    });
});

module.exports = router;
