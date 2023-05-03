import { Router } from 'express';
import * as userI from '../interfaces/User'
import * as protoGen from "../generated/access";
import * as utility from "../utilities"
import proto = protoGen.access;

import * as queryAsk from '../queries';
const router = Router();
export default router;


//this route manage the login a user
router.post('', async (req: {body: proto.User}, res) => {
	const oldps = req.body.password
	const userFound: userI.User = await queryAsk.login(req.body.email, utility.apply_hash(req.body.password))
	userFound.password = oldps;
    if(userFound.email != "") {
    	res.status(200).send(new proto.UserResponse({ message: "Confirmed login.", user: userI.generate_protoUser(userFound)}).toObject())
		return;
	}
	res.status(401).send(new proto.UserResponse({ message: "Wrong credentials." }).toObject())
});

