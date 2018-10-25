'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Folder = require('../models/folder');

const { folders } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Notes RESTful API', function() {
  before(function() {
    return mongoose
      .connect(
        TEST_MONGODB_URI,
        { useNewUrlParser: true }
      )
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function() {
    return Folder.insertMany(folders);
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('GET /api/folders/', function(){ 
    it('should return all folders', function(){ 
      return Promise.all([
        Folder.find(),
        chai.request(app).get('/api/folders')
      ])
      // 3) then compare database results to API response
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          //console.log('It\'s the body: ' + res.body.results);
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    }); 
  }); 

  describe('GET /api/folders/:id', function(){ 
    it('should return a file', function(){ 
      let data;
      // 1) First, call the database
      return Folder.findOne()
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return chai.request(app).get(`/api/folders/${data.id}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(
            'name',
            'id', 
            'createdAt', 
            'updatedAt'
          ); 
      

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    }); 
  }); 
  // describe('PUT /api/folders/:id', function() { 
  //   let data; 
  //   const newItem = { name : 'cheese', content : 'cheese'}; 
  //   it('should update and return a new item', function() { 
  //     return Note.findOne()
  //       .then(_data => { 
  //         data = _data; 
  //         return chai.request(app).put(`/api/notes/${data.id}`); 
  //       })
  //       .then((res) => { 
  //         expect(res).to.have.status(204); 
  //         expect(res.body.title).to.eql(newItem.title); 
  //       });
  //   });  
  // }); 

}); 

