import { Router } from 'express';
const queryAsk = require('../queries');
const router = Router();

export default router;


router.put('', async (req, res) => {
    const credentials = JSON.parse(req.body); //get the body from the request
    if(!credentials.hasOwnProperty('email') || !credentials.hasOwnProperty('password')) { //verify that body is well formatted
        res.status(400).send({
            message: "Message wrong formatted. Require 'email' and 'password' field."
        })
    }
    //now that we are sure the body is well formatted (other possible fields aren't valuated and will not be used)
    //time to check if the email already exists (email is DB key)
    
});

