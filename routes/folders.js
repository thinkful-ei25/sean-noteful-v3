'use strict';

const express = require('express');

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
  Folder.findById(id)
    .then(result => { 
      res.json(result); 
    })
    .catch(err => { 
      return next(err); 
    }); 
}); 


module.exports = router;