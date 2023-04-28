import { Router } from 'express';
import * as userI from '../interfaces/User'
import * as protoGen from "../generated/access";
import proto = protoGen.access;

const queryAsk = require('../queries');
const router = Router();
const re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");
export default router;


router.put('/help', async (req, res) => {
    const user:userI.User = await queryAsk.findUserWithEmail("first");
    console.log(user.email)
    res.send("done")
})

router.put('', async (req: {body: proto.createUserRequest}, res) => {
    if(!userI.verify_Basic_DataPresence(req.body)) { //verify that body is well formatted
        res.status(400).send(new proto.createUserResponse({message: "Message wrong formatted. Require Email, Password, Nome, Cognome fields."}).toObject())
        return;
    }
    //time to check if the email already exists (email is DB key)
    
    const user:userI.User = await queryAsk.findUserWithEmail(req.body.email);
    if(user.email) {
        res.status(400).send(new proto.createUserResponse({message: "Email already token."}).toObject())
        return;
    }
    //now check if password have all requirements
    if(!re.test(req.body.password)) {
        res.status(400).send(new proto.createUserResponse({ message: "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number!" }).toObject())
        return;
    }

    //now that password is ok and email is unique, we have to create the user
    req.body.password = encrypt(req.body.password);
});

