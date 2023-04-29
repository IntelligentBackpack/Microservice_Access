import { Router } from 'express';
import * as userI from '../interfaces/User'
import * as protoGen from "../generated/access";
import * as utility from "../utilities"
import proto = protoGen.access;

const queryAsk = require('../queries');
const router = Router();
const re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");
export default router;


//This route manage the creation of a new user
router.put('', async (req: {body: proto.UserRequest_Permissions}, res) => {
    //first verify that the new user have all mandatory field
    if(!userI.verify_Basic_DataPresence(req.body.nuovo_utente)) {
        res.status(400).send(new proto.UserResponse({message: "Message wrong formatted. Require Email, Password, Nome, Cognome fields."}).toObject())
        return;
    }
    
    const user:userI.User = await queryAsk.findUserWithEmail(req.body.nuovo_utente.email);
    if(user.email != "") {
        res.status(400).send(new proto.UserResponse({message: "Email already token."}).toObject())
        return;
    }
    //now check if password have all requirements
    if(!re.test(req.body.nuovo_utente.password)) {
        res.status(400).send(new proto.UserResponse({ message: "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number!" }).toObject())
        return;
    }

    //now that password is ok and email is unique, we have to create the user
    req.body.nuovo_utente.password = utility.apply_hash(req.body.nuovo_utente.password);
    await queryAsk.createUser(userI.assignVals_JSON(req.body.nuovo_utente))
    res.status(200).send(new proto.UserResponse({ message: "User created." }).toObject())
});

