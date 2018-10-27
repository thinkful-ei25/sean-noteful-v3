'use strict';

const chai = require('chai'); 
const chaiHttp = require('chai-http'); 
const mongoose = require('mongoose'); 

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const {tags} = require('../db/seed/data');
const Tag = require('../models/tag'); 

const expect = chai.expect;
chai.use(chaiHttp);

describe('Tag API test', () => {
  before(function() {
    return mongoose
      .connect(
        TEST_MONGODB_URI,
        { useNewUrlParser: true }
      )
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function() {
    return Tag.insertMany(tags);
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('GET /api/tags/', function(){ 
    it('should return all tags', function(){ 
      return Promise.all([
        Tag.find(),
        chai.request(app).get('/api/tags')
      ])
      // 3) then compare database results to API response
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    }); 
  }); 

  describe('GET /api/tags/:id', function(){ 
    it('should return a file', function(){ 
      let data;
      return Tag.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/tags/${data.id}`);
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
      
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    }); 
  }); 

  describe('POST /api/tags', function() {
    it('should create and return a new item when provided valid data', function() {
      const newItem = {
        name: 'Wowing'
      };

      let res;
      return (
        chai
          .request(app)
          .post('/api/tags')
          .send(newItem)
          .then(function(_res) {
            res = _res;
            expect(res).to.have.status(201);
            expect(res).to.have.header('location');
            expect(res).to.be.json;
            expect(res.body).to.have.keys(
              'id',
              'name',
              'createdAt',
              'updatedAt'
            );
            return Tag.findById(res.body.id);
          })
          // 3) then compare the API response to the database results
          .then(data => {
            expect(res.body.id).to.equal(data.id);
            expect(res.body.name).to.equal(data.name);
            expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
            expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
          })
      );
    });
  });

  describe('DELETE /api/tags', function(){ 
    let data; 
    it('should find a note and delte it', function() { 
      return Tag.findOne()
        .then(_data => { 
          data =_data; 
          return chai.request(app).del(`/api/tags/${data.id}`); 
        })
        .then((res) => { 
          expect(res).to.have.status(204); 
        }); 
    }); 
  }); 

}); 