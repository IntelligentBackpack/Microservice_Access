import * as protoGen from '../generated/access';
import proto = protoGen.access;

export interface Istituto {
    ID: number;
    IstitutoNome: string;
    IstitutoCitta: string;
}

export function defaultIstituto(): Istituto {
    const istituto: Istituto = {ID: -1, IstitutoNome: "", IstitutoCitta: ""};
    return istituto;
}

export function assignVals_JSON(json: any): Istituto {
    var istituto: Istituto = {ID: json.ID, IstitutoNome: json.nome, IstitutoCitta: json.citta};
    return istituto;
}

export function assignVals_DB(Json: any): Istituto {
    var istituto: Istituto = {ID: Json.ID, IstitutoNome: Json.Nome, IstitutoCitta: Json.Città};
    return istituto;
}

export function generate_protoIstituto(json: any): proto.Istituto {
    if(json != undefined)
        return new proto.Istituto({ID: json.ID, IstitutoNome: json.IstitutoNome, IstitutoCitta: json.IstitutoCitta})
    return new proto.Istituto(defaultIstituto())
}

export function verify_Basic_DataPresence(json: any): boolean {    
    return (json.ID && json.IstitutoNome && json.IstitutoCitta)
}

export function toString(ist: Istituto): string {
    return " ISTITUTO ID: " + ist.ID + " ISTITUTO NOME: " + ist.IstitutoNome + " ISTITUTO CITTA: " + ist.IstitutoCitta
}

export function isAssigned(ist: Istituto): boolean {
    return ist.ID != -1 && ist.IstitutoNome != "" && ist.IstitutoCitta != ""
}