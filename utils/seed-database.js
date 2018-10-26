'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder'); 
const Tag = require('../models/tag'); 

const { notes, folders, tags } = require('../db/seed/data');

console.info('Connecting to:', MONGODB_URI);
mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Folder.createIndexes(), 
      Tag.insertMany(tags)
    ]);
  })
  .then(results => {
    // eslint-disable-next-line no-console
    console.info(`Inserted ${results.length} Notes`);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error(err);
  });