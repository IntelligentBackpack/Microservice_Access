import * as protoGen from '../generated/access';
import * as Istituto from './Istituto';
import proto = protoGen.access;

export interface User {
    email: string;
    password: string;
    nome: string;
    cognome: string;
    istituto?: Istituto.Istituto;
    ruolo: number;
    classe?: string
}

export function defaultUser(): User {
    const user: User = {email: "", password: "", nome: "", cognome: "", istituto: Istituto.defaultIstituto(), ruolo: 0, classe: ""};
    return user;
}

export function assignVals_JSON(json: any, ist?: Istituto.Istituto): User {
    var user: User = {email: json.email, password: json.password, nome: json.nome, cognome: json.cognome, 
                        istituto: ist, ruolo: json.ruolo, classe: json.classe};
    return user;
}

export function assignVals_DB(Json: any, Ist?: Istituto.Istituto): User {
    var user: User = {email: Json.Email, password: Json.Password, nome: Json.Nome, cognome: Json.Cognome, 
                        istituto: Ist, ruolo: Json.Ruolo, classe: Json.Classe};
    return user;
}

export function generate_protoUser(json: any): proto.User {
    return new proto.User({email: json.email, password: json.password, nome: json.nome, cognome: json.cognome, 
                            istituto: Istituto.generate_protoIstituto(json.istituto), role: json.ruolo, classe: json.classe})
}

export function verify_Basic_DataPresence(json: any): boolean {    
    return (json.email && json.password && json.nome && json.cognome)
}

export function toString(user: User): string {    
    return "EMAIL: " + user.email + " PASSWORD: " + user.password + " NOME: " + user.nome + " COGNOME: " + user.cognome + " ISTITUTO ID: " + user.istituto?.ID + " ISTITUTO NOME: " + user.istituto?.IstitutoNome + " ISTITUTO CITTA: " + user.istituto?.IstitutoCitta + " RUOLO: " + user.ruolo + " CLASSE: " + user.classe
}

export function isAssigned(user: User): boolean {
    return user.email != "" && user.password != "" && user.nome != "" && user.cognome != ""
}