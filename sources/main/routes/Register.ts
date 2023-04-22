import { Router } from 'express';
//import { encrypt } from '../utilities'
const queryAsk = require('../queries');
const router = Router();

const re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");
export default router;


router.put('', async (req, res) => {
    const credentials = JSON.parse(req.body); //get the body from the request
    if(!credentials.hasOwnProperty('email') || !credentials.hasOwnProperty('password')) { //verify that body is well formatted
        res.status(400).send({
            message: "Message wrong formatted. Require 'email' and 'password' field."
        })
        return;
    }
    //now that we are sure the body is well formatted (other possible fields aren't valuated and will not be used)
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

