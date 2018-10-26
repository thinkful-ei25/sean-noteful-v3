'use strict';

const express = require('express');
const router = express.Router();

const Tag = require('../models/tag');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  Tag.find()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      return next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Tag.findById(id)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      return next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  
  const {name} = req.body; 
  const newItem = {name}; 
  const newArg = {new :true}; 

  Tag.findByIdAndUpdate(id, newItem, newArg)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      return next(err);
    });
});

router.post('/', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const newTag = { name };

  Tag.create(newTag)
    .then(result => {
      res
        .location(`/api/tags/${id}`)
        .status(204)
        .json(result);
    })
    .catch(err => {
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
