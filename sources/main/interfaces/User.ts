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
    const user: User = {email: json.Email, password: json.Password, nome: json.Nome, cognome: json.Cognome, 
                        istituto: json.Istituto_Iscritto, ruolo: json.Ruolo, classe: json.Classe};
    return user;
}

export function verify_Basic_DataPresence(json: any): boolean {
    return (json.hasOwnProperty('Email') && json.hasOwnProperty('Password') && json.hasOwnProperty('Nome') && json.hasOwnProperty('Cognome'))
}