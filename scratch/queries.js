'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => {
    const searchTerm = 'cats';
    let filter = {};

    if (searchTerm) {
      filter.title = { $regex: searchTerm };
    }
    //filter = {$or([{ title: searchTerm }, { content: searchTerm }]); 

    return Note.find(filter).sort({ updatedAt: 'desc' });
  })
  .then(results => {
    console.log('what\'s up yo');
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect(); 
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => { 
//     const id = '000000000000000000000002'; 
//     return Note.findById(id); 
//   })
//   .then(results => { 
//     console.log('Results: ' + results);
//   })
//   .then(() => { 
//     return mongoose.disconnect(); 
//   })
//   .catch(err => { 
//     console.error(`ERROR RUN!!! ${err}`);
//   }); 

// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => { 
//     const newNote = { 
//       title : 'lupin is my dog', 
//       content : 'we go on long relaxing walks together'
//     }; 
//     return Note.create(newNote); 
//   })
//   .then(results => { 
//     console.log('Results: ' + results);
//   })
//   .then(() => { 
//     return mongoose.disconnect(); 
//   })
//   .catch(err => { 
//     console.error(`ERROR RUN!!! ${err}`);
//   }); 

// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => { 
//     const id = '000000000000000000000007'; 

//     const newNote = { 
//       title: 'lupi', 
//       content : 'he hurt is paw today :('
//     }; 
//     return Note.findOneAndUpdate({_id : id}, {$set : newNote}); 
//   })
//   .then(results => { 
//     console.log('Results: ' + results);
//   })
//   .then(() => { 
//     return mongoose.disconnect(); 
//   })
//   .catch(err => { 
//     console.error(`ERROR RUN!!! ${err}`);
//   }); 

// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => { 
//     const id = '000000000000000000000007'; 


//     return Note.findByIdAndRemove(id); 
//   })
//   .then(results => { 
//     console.log('Results: ' + results);
//   })
//   .then(() => { 
//     return mongoose.disconnect(); 
//   })
//   .catch(err => { 
//     console.error(`ERROR RUN!!! ${err}`);
//   }); 

