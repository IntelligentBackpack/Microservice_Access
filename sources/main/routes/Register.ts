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
router.put('', async (req: {body: proto.User}, res) => {
    //first verify that the new user have all mandatory field
    if(!userI.verify_Basic_DataPresence(req.body)) {
        res.status(400).send(new proto.UserResponse({message: "Message wrong formatted. Require Email, Password, Nome, Cognome fields."}).toObject())
        return;
    }
    
    const user:userI.User = await queryAsk.findUserWithEmail(req.body.email);
    if(user.email != "") {
        res.status(400).send(new proto.UserResponse({message: "Email already token."}).toObject())
        return;
    }
    //now check if password have all requirements
    if(!re.test(req.body.password)) {
        res.status(400).send(new proto.UserResponse({ message: "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number!" }).toObject())
        return;
    }

    //now that password is ok and email is unique, we have to create the user
    let oldps: string = req.body.password;
    req.body.password = utility.apply_hash(req.body.password);
    await queryAsk.createUser(userI.assignVals_JSON(req.body))
    res.status(200).send(new proto.User({email: req.body.email,
                                        password: oldps,
                                        nome: req.body.nome,
                                        cognome: req.body.cognome,
                                        role: proto.Role.USER}).toObject())
});

