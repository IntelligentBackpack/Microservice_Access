import { Router } from 'express';
import * as userI from '../interfaces/User'
import * as protoGen from "../generated/access";
import proto = protoGen.access;

const queryAsk = require('../queries');
const router = Router();
export default router;


//this route manage the remove of a user
router.delete('', async (req: {body: proto.UserRequest_Permissions}, res) => {
    if(!await queryAsk.verifyPrivileges_HIGH(req.body.email_Creatore)) {
        res.status(401).send(new proto.UserResponse({message: "You can't do that here."}).toObject())
        return;
    }
    await queryAsk.deleteUser(userI.assignVals_JSON(req.body.nuovo_utente))
    res.status(200).send(new proto.UserResponse({ message: "User deleted." }).toObject())
});

