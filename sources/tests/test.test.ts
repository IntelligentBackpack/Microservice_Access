import request from 'supertest';
import app, { response } from '../main/app';
import * as protoGen from '../main/generated/access';
import proto = protoGen.access;

jest.setTimeout(15000);



describe('Testing register routing', function() {
    it('Should return an error 400 for bad message format', async() => {
        const message: proto.createUserRequest = new proto.createUserRequest({email: "mario", password: "password"});
        const serverResponse = await request(app).put('/register/').send(message.toObject());

        expect(serverResponse.statusCode).toBe(400)
        expect(serverResponse.body.message).toBe("Message wrong formatted. Require Email, Password, Nome, Cognome fields.")
    });

    it("should return error 400 for bad password", async() => {
        const message: proto.createUserRequest = new proto.createUserRequest({email: "asd", password: "password", nome: "mario", cognome: "rossi"});
        const serverResponse = await request(app).put('/register').send(message.toObject());

        expect(serverResponse.statusCode).toBe(400)
        expect(serverResponse.body.message).toBe("Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number!")
    })



});