'use strict';

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Folder = require('../models/folder');
const Note = require('../models/note');

router.get('/', (req, res, next) => {
  Folder.find()
    .sort({ name: 1 })
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

  Folder.findById(id)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      return next(err);
    });
});

router.post('/', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const newFolder = { name };

  Folder.create(newFolder)
    .then(result => {
      res
        .location(`/api/folders/${id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      return next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateFolder = { name };

  Folder.findOneAndUpdate({ _id: id }, { $set: updateFolder })
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Promise.all([
    Folder.findByIdAndRemove(id),
    Note.remove({ folderId: id })
  ])
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      return next(err);
    });
});

module.exports = router;
