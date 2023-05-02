import * as protoGen from '../generated/access';
import proto = protoGen.access;

export interface User {
    email: string;
    password: string;
    nome: string;
    cognome: string;
    istituto?: number;
    ruolo: number;
    classe?: string
}

export function defaultUser(): User {
    const user: User = {email: "", password: "", nome: "", cognome: "", istituto: -1, ruolo: 0, classe: ""};
    return user;
}

export function assignVals_JSON(json: any): User {
    const user: User = {email: json.email, password: json.password, nome: json.nome, cognome: json.cognome, 
                        istituto: json.istituto, ruolo: json.ruolo, classe: json.classe};
    return user;
}

export function generate_protoUser(json: any): proto.User {
    return new proto.User({email: json.email, password: json.password, nome: json.nome, cognome: json.cognome, 
                            istituto: json.istituto, role: json.ruolo, classe: json.classe})
}

export function verify_Basic_DataPresence(json: any): boolean {    
    return (json.email && json.password && json.nome && json.cognome)
}