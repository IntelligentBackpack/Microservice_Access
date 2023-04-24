import request from 'supertest';
import app from '../main/app'
const baseURL = "http://localhost:80"

describe('Testing base', function() {


    it('responds with hello', function(done) {
      request(app)
        .get('/login/hello')
        .expect('hello to you', done);
    });
  });