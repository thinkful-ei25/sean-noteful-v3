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
  const {id} = req.params; 

  Tag.findById(id)
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