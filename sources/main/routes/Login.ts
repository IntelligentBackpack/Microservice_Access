import { Router } from 'express';
import * as protoGen from "../generated/access";
import * as utility from "../utilities"
import proto = protoGen.access;

const queryAsk = require('../queries');
const router = Router();
export default router;


//this route manage the remove of a user
router.post('', async (req: {body: proto.User}, res) => {
    if(await queryAsk.login(req.body.email, utility.apply_hash(req.body.password))) {
    	res.status(200).send(new proto.UserResponse({ message: "Confirmed login." }).toObject())
		return;
	}
	res.status(401).send(new proto.UserResponse({ message: "Wrong credentials." }).toObject())
});

