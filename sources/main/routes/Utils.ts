import { Router } from 'express';
import * as protoGen from "../generated/access";
import * as userI from '../interfaces/User'
import * as utility from "../utilities"


import proto = protoGen.access;

import * as queryAsk from '../queries';
const router = Router();
const re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");

export default router;




router.post('/change_nome', async (req: {body: proto.User}, res) => {
    if(await queryAsk.change_name(userI.assignVals_JSON(req.body))) {
    	res.status(200).send(new proto.UserResponse({ message: "Confirmed change to name.", user: userI.generate_protoUser(req.body)}).toObject())
		return;
	}
	res.status(500).send(new proto.UserResponse({ message: "Cannot change name"}).toObject())
});

router.post('/change_cognome', async (req: {body: proto.User}, res) => {
    if(await queryAsk.change_cognome(userI.assignVals_JSON(req.body))) {
    	res.status(200).send(new proto.UserResponse({ message: "Confirmed change to cognome.", user: userI.generate_protoUser(req.body)}).toObject())
		return;
	}
	res.status(500).send(new proto.UserResponse({ message: "Cannot change cognome" }).toObject())
});

router.post('/change_email', async (req: {body: proto.UserRequest_ChangeEmail}, res) => {
    const user:userI.User = await queryAsk.findUserWithEmail(req.body.nuova_Email);
    if(user.email != "") {
        res.status(400).send(new proto.UserResponse({ message: "New email already exists!" }).toObject())
		return;        
    }

    if(await queryAsk.change_email(req.body.user.email, req.body.nuova_Email)) {
        req.body.user.email = req.body.nuova_Email;
    	res.status(200).send(new proto.UserResponse({ message: "Confirmed change to email.", user: userI.generate_protoUser(req.body.user) }).toObject())
		return;
	}
	res.status(500).send(new proto.UserResponse({ message: "Cannot change email" }).toObject())
});

router.post('/change_password', async (req: {body: proto.User}, res) => {

    if(!re.test(req.body.password)) {
        res.status(400).send(new proto.UserResponse({ message: "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number!" }).toObject())
        return;
    }

    let ps: string = req.body.password;
    req.body.password = utility.apply_hash(req.body.password);

    if(await queryAsk.change_password(userI.assignVals_JSON(req.body))) {
        req.body.password = ps;
    	res.status(200).send(new proto.UserResponse({ message: "Confirmed change to password.", user: userI.generate_protoUser(req.body)}).toObject())
		return;
	}
	res.status(500).send(new proto.UserResponse({ message: "Cannot change password" }).toObject())
});