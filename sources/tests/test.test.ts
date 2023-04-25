import request from 'supertest';
import app from '../main/app';
import * as protoGen from '../main/sources/proto/users';
import req = protoGen.userspackage.UserRequest;

const baseURL = "http://localhost:80"


describe('Testing base', function() {
    it('test', function(done) {
        request(app)
            .get('/login/hello')
            .expect("hello to you", done)
    });

    it('responds with hello', function(done) {
        const message: req = new req({name: "mario", password: "password"})
        console.log("before sending: " + message.name + " " + message.password)
        expect(2+2 == 4)
    });

  });