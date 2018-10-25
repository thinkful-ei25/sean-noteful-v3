'use strict';

const express = require('express');
const mongoose = require('mongoose'); 

const router = express.Router();
const Folder = require('../models/folder');

router.get('/', (req, res, next) => { 
  Folder.find()
    .sort({ name : 1})
    .then(result => { 
      res.json(result); 
    })
    .catch(err => { 
      return next(err);  
    }); 
}); 

router.get('/:id', (req, res, next) => { 
  const {id} = req.params; 

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
  const {id} = req.params; 
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


module.exports = router;
