import { Router } from 'express';
import * as userI from '../interfaces/User'
import * as protoGen from "../generated/access";
import proto = protoGen.access;

const queryAsk = require('../queries');
const router = Router();
export default router;


//this route manage the remove of a user
router.delete('', async (req: {body: proto.User}, res) => {
    await queryAsk.deleteUser(userI.assignVals_JSON(req.body))
    res.status(200).send(new proto.UserResponse({ message: "User deleted." }).toObject())
});

