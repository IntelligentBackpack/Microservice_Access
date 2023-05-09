import { Router } from 'express';
import * as protoGen from "../generated/access";
import * as userI from '../interfaces/User'
import * as utility from "../utilities"
import proto = protoGen.access;

import * as queryAsk from '../queries';
import * as Istituto from '../interfaces/Istituto';
import * as User from '../interfaces/User'
const router = Router();
const re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");

export default router;


router.get('/get_istituto', async (req, res) => {
	if(req.query.id == undefined) {
		res.status(200).send(Istituto.generate_protoIstituto(Istituto.defaultIstituto()).toObject());
		return;
	}
	res.status(200).send(Istituto.generate_protoIstituto(await queryAsk.get_istituto_info(+req.query.id)).toObject())
	return;
});

router.get('/get_istituti', async (req, res) => {
	const istituti: Istituto.Istituto[] = await queryAsk.get_istituti();
	var protoData: proto.Response_Istituti = new proto.Response_Istituti({})
	for(let ist of istituti) {
		protoData.istituti.push(Istituto.generate_protoIstituto(ist))
	}
	res.status(200).send(protoData.toObject())
	return;
});

router.get('/emailExists', async (req, res) => {
	if(req.query.email == undefined) {
		res.status(200).send(User.generate_protoUser(User.defaultUser()).toObject());
		return;
	}
	res.status(200).send(User.generate_protoUser(await queryAsk.findUserWithEmail(req.query.email.toString())).toObject())
	return;
});


router.get('/verifyPrivileges_HIGH', async (req, res) => {
	if(req.query.email == undefined) {
		res.status(401).send(new proto.BasicMessage({ message: "Error"}).toObject())
		return;
	}
	if(await queryAsk.verifyPrivileges_HIGH(req.query.email.toString())) {
		res.status(200).send(new proto.BasicMessage({ message: "High"}).toObject())
		return;
	}
	res.status(401).send(new proto.BasicMessage({ message: "Error"}).toObject())
});

router.get('/verifyPrivileges_LOW', async (req, res) => {
	if(req.query.email == undefined) {
		res.status(401).send(new proto.BasicMessage({ message: "Error"}).toObject())
		return;
	}
	if(await queryAsk.verifyPrivileges_LOW(req.query.email.toString())) {
		res.status(200).send(new proto.BasicMessage({ message: "Low"}).toObject())
		return;
	}
	res.status(401).send(new proto.BasicMessage({ message: "Error"}).toObject())
});


router.post('/change_nome', async (req: {body: proto.User}, res) => {
    if(await queryAsk.change_name(userI.assignVals_JSON(req.body))) {
    	res.status(200).send(new proto.UserResponse({ message: "Confirmed change to name.", user: userI.generate_protoUser(req.body)}).toObject())
		return;
	}
	/* istanbul ignore next */ res.status(500).send(new proto.UserResponse({ message: "Cannot change name"}).toObject())
});

router.post('/change_cognome', async (req: {body: proto.User}, res) => {
    if(await queryAsk.change_cognome(userI.assignVals_JSON(req.body))) {
    	res.status(200).send(new proto.UserResponse({ message: "Confirmed change to cognome.", user: userI.generate_protoUser(req.body)}).toObject())
		return;
	}
	/* istanbul ignore next */ res.status(500).send(new proto.UserResponse({ message: "Cannot change cognome" }).toObject())
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
	/* istanbul ignore next */ res.status(500).send(new proto.UserResponse({ message: "Cannot change email" }).toObject())
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
	/* istanbul ignore next */ res.status(500).send(new proto.UserResponse({ message: "Cannot change password" }).toObject())
});



router.post('/change_istituto', async (req: {body: proto.PermissionRequest_ChangeInstitute}, res) => {
	if(!await queryAsk.verifyPrivileges_HIGH(req.body.email_esecutore)) {
		res.status(401).send(new proto.UserResponse({ message: "You can't do this."}).toObject())
		return;
	}

    if(await queryAsk.change_istituto(req.body.email_utenteFinale, req.body.nuovo_istituto.ID)) {
    	res.status(200).send(new proto.UserResponse({ message: "Istituto changed successfully."}).toObject())
		return;
	}
	/* istanbul ignore next */ res.status(500).send(new proto.UserResponse({ message: "Cannot change istituto." }).toObject())
});

router.post('/change_ruolo', async (req: {body: proto.PermissionRequest_ChangeRuolo}, res) => {
	if(!await queryAsk.verifyPrivileges_HIGH(req.body.email_esecutore)) {
		res.status(401).send(new proto.UserResponse({ message: "You can't do this."}).toObject())
		return;
	}

    if(await queryAsk.change_ruolo(req.body.email_utenteFinale, req.body.nuovo_ruolo)) {
    	res.status(200).send(new proto.UserResponse({ message: "Ruolo changed successfully."}).toObject())
		return;
	}
	/* istanbul ignore next */ res.status(500).send(new proto.UserResponse({ message: "Cannot change ruolo" }).toObject())
});

router.post('/change_classe', async (req: {body: proto.PermissionRequest_ChangeClasse}, res) => {
	if(!await queryAsk.verifyPrivileges_HIGH(req.body.email_esecutore)) {
		res.status(401).send(new proto.UserResponse({ message: "You can't do this."}).toObject())
		return;
	}

    if(await queryAsk.change_classe(req.body.email_utenteFinale, req.body.nuova_classe)) {
    	res.status(200).send(new proto.UserResponse({ message: "Classe changed successfully."}).toObject())
		return;
	}
	/* istanbul ignore next */ res.status(500).send(new proto.UserResponse({ message: "Cannot change classe" }).toObject())
});