import request from 'supertest';
import app, { response } from '../main/app';
import * as protoGen from '../main/generated/access';
import proto = protoGen.access;

jest.setTimeout(15000);

const admin: proto.User = new proto.User({email: "admin", password: "admin", nome: "admin", cognome: "admin"});

describe('Testing register routing', function() {
    it('Should return an error 400 for bad message format', async() => {
        //data
        const user: proto.User = new proto.User({email: "mario", password: "password"});
        const message: proto.createUserRequest = new proto.createUserRequest({email_Creatore: "admin", nuovo_utente: user})
        //request
        const serverResponse = await request(app).put('/register/').send(message.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(400)
        expect(serverResponse.body.message).toBe("Message wrong formatted. Require Email, Password, Nome, Cognome fields.")
    });

    it("should return error 400 for bad password", async() => {
        //data
        const user: proto.User = new proto.User({email: "asd", password: "password", nome: "mario", cognome: "rossi"});
        const message: proto.createUserRequest = new proto.createUserRequest({email_Creatore: "admin", nuovo_utente: user})
        //request
        const serverResponse = await request(app).put('/register').send(message.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(400)
        expect(serverResponse.body.message).toBe("Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number!")
    })

    it("should return error 401 for no privileges", async() => {
        //data
        const user: proto.User = new proto.User({email: "asd", password: "password", nome: "mario", cognome: "rossi"});
        const message: proto.createUserRequest = new proto.createUserRequest({email_Creatore: "notadmin", nuovo_utente: user})
        //request
        const serverResponse = await request(app).put('/register').send(message.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(401)
        expect(serverResponse.body.message).toBe("You can't do that here.")
    })

    it("should create a new user", async() => {
        //data
        const user: proto.User = new proto.User({email: "mario.rossi", password: "asdRE7687fds", nome: "mario", cognome: "rossi"});
        const message: proto.createUserRequest = new proto.createUserRequest({email_Creatore: "admin", nuovo_utente: user})
        //request
        const serverResponse = await request(app).put('/register').send(message.toObject());
        //recive
        expect(serverResponse.body.message).toBe("User created.")
    })



});