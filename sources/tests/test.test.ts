import request from 'supertest';
import app, { response } from '../main/app';
import * as protoGen from '../main/generated/access';
import proto = protoGen.access;

jest.setTimeout(30000);

const userBad: proto.User = new proto.User({email: "mario", password: "password", nome: "mario", cognome: "rossi"});
const userGood: proto.User = new proto.User({email: makeid(15), password: "asdRE7687fds", nome: "mario", cognome: "rossi"});

describe('Testing register routing', function() {
    it('Should return an error 400 for bad message format', async() => {
        //data
        const user: proto.User = new proto.User({email: "mario", password: "password", nome: "mario"});
        const message: proto.UserRequest_Permissions = new proto.UserRequest_Permissions({email_Creatore: "admin", nuovo_utente: user})
        //request
        const serverResponse = await request(app).put('/register/').send(message.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(400)
        expect(serverResponse.body.message).toBe("Message wrong formatted. Require Email, Password, Nome, Cognome fields.")
    });

    it("should return error 400 for bad password", async() => {
        //data
        const message: proto.UserRequest_Permissions = new proto.UserRequest_Permissions({email_Creatore: "admin", nuovo_utente: userBad})
        //request
        const serverResponse = await request(app).put('/register').send(message.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(400)
        expect(serverResponse.body.message).toBe("Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number!")
    })

    it("should create a new user", async() => {
        //data
        const message: proto.UserRequest_Permissions = new proto.UserRequest_Permissions({email_Creatore: "admin", nuovo_utente: userGood})
        //request
        const serverResponse = await request(app).put('/register').send(message.toObject());
        //recive
        expect(serverResponse.body.message).toBe("User created.")
    })
});


describe('Testing login routing', function() {
    it("should login a user", async() => {
        //request
        const serverResponse = await request(app).post('/login').send(userGood.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(200)
        expect(serverResponse.body.message).toBe("Confirmed login.")
    })

    it("should should fail the login", async() => {
        //request
        const serverResponse = await request(app).post('/login').send(userBad.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(401)
        expect(serverResponse.body.message).toBe("Wrong credentials.")
    })
});


describe('Testing remove routing', function() {
    it("should return error 401 for no privileges in delete", async() => {
        //data
        const message: proto.UserRequest_Permissions = new proto.UserRequest_Permissions({email_Creatore: "notadmin", nuovo_utente: userGood})
        //request
        const serverResponse = await request(app).delete('/remove').send(message.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(401)
        expect(serverResponse.body.message).toBe("You can't do that here.")
    })

    it("should delete a user", async() => {
        //data
        const message: proto.UserRequest_Permissions = new proto.UserRequest_Permissions({email_Creatore: "admin", nuovo_utente: userGood})
        //request
        const serverResponse = await request(app).delete('/remove').send(message.toObject());
        //recive
        expect(serverResponse.body.message).toBe("User deleted.")
    })
});



function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter: number = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}