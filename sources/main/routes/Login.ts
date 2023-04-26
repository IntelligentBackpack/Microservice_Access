import { Router } from 'express';
const queryAsk = require('../queries');
const router = Router();
import * as protoGen from "../generated/users";
import Req = protoGen.userspackage.UserRequest;

export default router;


router.get('', async (req, res) => {
	res.send('Express + TypeScript Server from router with query ' + await queryAsk.query1());
});


router.get('/hello', async (req, res) => {
	res.send('hello to you');
});

router.put('/hello', async (req: { body: Req; }, res) => {
	const test = req.body;
	console.log("recived: " + req.body.name + " " + req.body.password)

	res.send('hello to you');
});