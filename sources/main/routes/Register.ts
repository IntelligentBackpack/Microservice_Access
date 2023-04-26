import { Router } from 'express';
import * as userI from '../interfaces/User'
const queryAsk = require('../queries');
const router = Router();

const re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");
export default router;


router.put('', async (req, res) => {
    const credentials = JSON.parse(req.body); //get the body from the request
    if(!userI.verify_Basic_DataPresence(credentials)) { //verify that body is well formatted
        res.status(400).send({
            message: "Message wrong formatted. Require Email, Password, Nome, Cognome fields."
        })
        return;
    }
    //time to check if the email already exists (email is DB key)
    if(await queryAsk.findUserWithEmail(credentials.email).email != "") { //Query the db if an user already exists with the given Email
        res.status(400).send({
            message: "Email already in use!"
        })
        return;
    }
    //now check if password have all requirements
    if(!re.test(credentials.password)) {
        res.status(400).send({
            message: "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number!"
        })
        return;
    }
    //now that password is ok and email is unique, we have to create the user
    //encrypt(credentials.password);
});

