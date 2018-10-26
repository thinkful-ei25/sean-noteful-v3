'use strict';

const express = require('express'); 
const router = express.Router(); 

const Folder = require('../models/folder'); 
const mongoose = require('mongoose'); 



router.get('/', (req, res, next) => { 
  Folder.find()
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

router.put('/:id', (req, res, next) => { 

}); 

router.post('/', (req, res, next) => { 

}); 

router.delete('/:id', (req, res, next) => { 

}); 

module.exports = router;  