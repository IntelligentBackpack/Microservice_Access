import request from 'supertest';
import app, { response } from '../main/app';
import * as protoGen from '../main/generated/access';
import proto = protoGen.access;

jest.setTimeout(15000);

const userBad: proto.User = new proto.User({email: "mario", password: "password", nome: "mario", cognome: "rossi"});
const userGood: proto.User = new proto.User({email: makeid(15), password: "asdRE7687fds", nome: "mario", cognome: "rossi"});
const istituto: proto.Istituto = new proto.Istituto({ID: 0, IstitutoNome: "Giulio Cesare", IstitutoCitta: "Marghera"})


describe('Testing register routing', function() {
    it('Should return an error 400 for bad message format', async() => {
        //data
        const user: proto.User = new proto.User({email: "mario", password: "password", nome: "mario"});        
        //request
        const serverResponse = await request(app).put('/register/').send(user.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(400)
        expect(serverResponse.body.message).toBe("Message wrong formatted. Require Email, Password, Nome, Cognome fields.")
    });

    it("should return error 400 for bad password", async() => {
        //request
        const serverResponse = await request(app).put('/register').send(userBad.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(400)
        expect(serverResponse.body.message).toBe("Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number!")
    })

    it("should create a new user", async() => {
        //request
        const serverResponse = await request(app).put('/register').send(userGood.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(200)
        expect(serverResponse.body.email).toBe(userGood.email)
        expect(serverResponse.body.password).toBe(userGood.password)
        expect(serverResponse.body.nome).toBe(userGood.nome)
        expect(serverResponse.body.cognome).toBe(userGood.cognome)
        expect(serverResponse.body.role).toBe(proto.Role.USER)
    })

    it("should give error 400 for email already in use", async() => {
        //request
        const serverResponse = await request(app).put('/register').send(userGood.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(400)
        expect(serverResponse.body.message).toBe("Email already token.")
    })
});

describe('Testing login routing', function() {
    it("should login a user", async() => {
        //request
        const serverResponse = await request(app).post('/login').send(userGood.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(200)
        expect(serverResponse.body.message).toBe("Confirmed login.")
        expect(serverResponse.body.user.email).toBe(userGood.email)
        expect(serverResponse.body.user.password).toBe(userGood.password)
        expect(serverResponse.body.user.nome).toBe(userGood.nome)
        expect(serverResponse.body.user.cognome).toBe(userGood.cognome)
    })

    it("should should fail the login", async() => {
        //request
        const serverResponse = await request(app).post('/login').send(userBad.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(401)
        expect(serverResponse.body.message).toBe("Wrong credentials.")
    })
});

describe('testing utility routing', function() {
    it("should give default page", async () => {
        const serverResponse = await request(app).get('').send();
        expect(serverResponse.text).toBe("Access control microservice")
    })

    it("should change nome to user", async () => {
        userGood.nome = "mario_CHANGED"
        const serverResponse = await request(app).post('/utility/change_nome').send(userGood.toObject());
        expect(serverResponse.statusCode).toBe(200)
        expect(serverResponse.body.message).toBe("Confirmed change to name.")
        expect(serverResponse.body.user.email).toBe(userGood.email)
        expect(serverResponse.body.user.password).toBe(userGood.password)
        expect(serverResponse.body.user.nome).toBe("mario_CHANGED")
        expect(serverResponse.body.user.cognome).toBe(userGood.cognome)
    })

    it("should change cognome to user", async () => {
        userGood.cognome = "rossi_CHANGED"
        const serverResponse = await request(app).post('/utility/change_cognome').send(userGood.toObject());
        expect(serverResponse.statusCode).toBe(200)
        expect(serverResponse.body.message).toBe("Confirmed change to cognome.")
        expect(serverResponse.body.user.email).toBe(userGood.email)
        expect(serverResponse.body.user.password).toBe(userGood.password)
        expect(serverResponse.body.user.nome).toBe(userGood.nome)
        expect(serverResponse.body.user.cognome).toBe("rossi_CHANGED")
    })

    it("should not change email because it already exists", async () => {
        const serverResponse = await request(app).post('/utility/change_email').send(new proto.UserRequest_ChangeEmail({nuova_Email: userGood.email, user: userGood}).toObject());
        expect(serverResponse.statusCode).toBe(400)
        expect(serverResponse.body.message).toBe("New email already exists!")
    })

    it("should change email", async () => {
        const newEmail: string = makeid(15);
        const serverResponse = await request(app).post('/utility/change_email').send(new proto.UserRequest_ChangeEmail({nuova_Email: newEmail, user: userGood}).toObject());
        expect(serverResponse.statusCode).toBe(200)
        expect(serverResponse.body.message).toBe("Confirmed change to email.")
        expect(serverResponse.body.user.email).toBe(newEmail)
        expect(serverResponse.body.user.password).toBe(userGood.password)
        expect(serverResponse.body.user.nome).toBe(userGood.nome)
        expect(serverResponse.body.user.cognome).toBe(userGood.cognome)
        userGood.email = newEmail
    })

    it("should not change password because it's not good", async () => {
        userGood.password = "password"
        const serverResponse = await request(app).post('/utility/change_password').send(userGood.toObject());
        expect(serverResponse.statusCode).toBe(400)
        expect(serverResponse.body.message).toBe("Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number!")
        userGood.password = "asdRE7687fds"
    })

    it("should change password to the user", async () => {
        userGood.password = "asdRE7687fda"
        const serverResponse = await request(app).post('/utility/change_password').send(userGood.toObject());
        expect(serverResponse.statusCode).toBe(200)
        expect(serverResponse.body.message).toBe("Confirmed change to password.")
        expect(serverResponse.body.user.email).toBe(userGood.email)
        expect(serverResponse.body.user.password).toBe("asdRE7687fda")
        expect(serverResponse.body.user.nome).toBe(userGood.nome)
        expect(serverResponse.body.user.cognome).toBe(userGood.cognome)
    })
})

describe('testing utility permissions funcitons', function() {
    it("should change istituto to user", async () => {
        const serverResponse = await request(app).post('/utility/change_istituto').send((
            new proto.PermissionRequest_ChangeInstitute({email_esecutore: "admin", email_utenteFinale: userGood.email, nuovo_istituto: istituto}).toObject()));
        expect(serverResponse.statusCode).toBe(200)
        expect(serverResponse.body.message).toBe("Istituto changed successfully.")
    })

    it("should give error 401 for no permissions in change istituto", async () => {
        const serverResponse = await request(app).post('/utility/change_istituto').send((
            new proto.PermissionRequest_ChangeInstitute({email_esecutore: userGood.email, email_utenteFinale: userGood.email, nuovo_istituto: istituto}).toObject()));
        expect(serverResponse.statusCode).toBe(401)
        expect(serverResponse.body.message).toBe("You can't do this.")
    })

    it("should change ruolo to user", async () => {
        const serverResponse = await request(app).post('/utility/change_ruolo').send((
            new proto.PermissionRequest_ChangeRuolo({email_esecutore: "admin", email_utenteFinale: userGood.email, nuovo_ruolo: 1}).toObject()));
        expect(serverResponse.statusCode).toBe(200)
        expect(serverResponse.body.message).toBe("Ruolo changed successfully.")
    })

    it("should give error 401 for no permissions in change ruolo", async () => {
        const serverResponse = await request(app).post('/utility/change_ruolo').send((
            new proto.PermissionRequest_ChangeRuolo({email_esecutore: userGood.email, email_utenteFinale: userGood.email, nuovo_ruolo: 2}).toObject()));
        expect(serverResponse.statusCode).toBe(401)
        expect(serverResponse.body.message).toBe("You can't do this.")
    })

    it("should change classe to user", async () => {
        const serverResponse = await request(app).post('/utility/change_classe').send((
            new proto.PermissionRequest_ChangeClasse({email_esecutore: "admin", email_utenteFinale: userGood.email, nuova_classe: "5C"}).toObject()));
        expect(serverResponse.statusCode).toBe(200)
        expect(serverResponse.body.message).toBe("Classe changed successfully.")
    })

    it("should give error 401 for no permissions in change classe", async () => {
        const serverResponse = await request(app).post('/utility/change_classe').send((
            new proto.PermissionRequest_ChangeClasse({email_esecutore: userGood.email, email_utenteFinale: userGood.email, nuova_classe: "4C"}).toObject()));
        expect(serverResponse.statusCode).toBe(401)
        expect(serverResponse.body.message).toBe("You can't do this.")
    })
})

describe('Testing remove routing', function() {
    it("should delete a user", async() => {
        //request
        const serverResponse = await request(app).delete('/remove').send(userGood.toObject());
        //recive
        expect(serverResponse.statusCode).toBe(200)
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