export interface User {
    email: string;
    password: string;
    nome : string;
    cognome : string;
    istituto?: number;
    ruolo: number;
    classe?: string
}