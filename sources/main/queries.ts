import sql, { config } from 'mssql';
import * as userI from './interfaces/User';
import * as Istituto from './interfaces/Istituto';

const conf: config = {
    user: 'CloudSA665ece82', // better stored in an app setting such as process.env.DB_USER
    password: 'unibo99@23MLABDL', // better stored in an app setting such as process.env.DB_PASSWORD
    server: 'smartbaguniboserver.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'smartbagDB', // better stored in an app setting such as process.env.DB_NAME
    options: {
        encrypt: true
    }
}

export async function findUserWithEmail(email: String): Promise<userI.User> {
    let user: userI.User = userI.defaultUser();
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("select * from Utente where Email = '" + email + "'"); //execute the query
        poolConnection.close(); //close connection with database
        // ouput row contents from default record set

        if(resultSet.rowsAffected[0] == 0)
            return user;

        var istituto: number = -1;  
        var data: any;
        resultSet.recordset.forEach(function(row: any) {
            data = row;
            if(row.Istituto_Iscritto != null)
                istituto = row.Istituto_Iscritto
        });
        if(istituto > -1) {
            const ist: Istituto.Istituto = await get_istituto_info(istituto)
            user = userI.assignVals_DB(data, ist);
        }
        else
            user = userI.assignVals_DB(data);
    } catch (e: any) {
        console.error(e);
    }
    return user; //return back all the found values
}

export async function login(email: string, password: string): Promise<userI.User> {
    let user: userI.User = userI.defaultUser();
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("select * from Utente where Email = '" + email + "' AND Password = '" + password + "'"); //execute the query
        poolConnection.close(); //close connection with database

        if(resultSet.rowsAffected[0] == 0)
            return user;
        // ouput row contents from default record set
        var istituto: number = -1;  
        var data: any;

        resultSet.recordset.forEach(function(row: any) {
            data = row;
            if(row.Istituto_Iscritto != null)
                istituto = row.Istituto_Iscritto
        });
        if(istituto > -1) {
            const ist: Istituto.Istituto = await get_istituto_info(istituto)
            user = userI.assignVals_DB(data, ist);
        }
        else
            user = userI.assignVals_DB(data);
    } catch (e: any) {
        console.error(e);
    }
    return user;
}

//il metodo è utilizzato per registrare un utente nella tabella degli utenti
export async function createUser(user: userI.User) {
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("insert into Utente values ('" + user.email + "', '" + user.password + "', '" + user.nome + "', '" + user.cognome + "', null, 0, null)"); //execute the query
        poolConnection.close(); //close connection with database
    } catch (e: any) {
        console.error(e);
    }
}

//il metodo viene utilizzato per verificare se la persona passata ha privilegi alti per eseguire l'azione
export async function verifyPrivileges_HIGH(emailEsecutore: string): Promise<boolean> {
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("select Ruolo from utente where ((Email = '" + emailEsecutore + "') AND (Ruolo >= 3) AND (Ruolo <= 4))"); //execute the query
        poolConnection.close(); //close connection with database
        return resultSet.rowsAffected[0] == 1
    } catch (e: any) {
        console.error(e);
    }
    return false;
}

//il metodo viene utilizzato per verificare se la persona passata ha privilegi bassi per eseguire l'azione
export async function verifyPrivileges_LOW(emailEsecutore: string): Promise<boolean> {
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("select ruolo from utente where ((Email = '" + emailEsecutore + "') AND (Ruolo >= 2) AND (Ruolo <= 4))"); //execute the query
        poolConnection.close(); //close connection with database
        resultSet.recordset.forEach(function(row: any) {
            return true;
        });
    } catch (e: any) {
        console.error(e);
    }
    return false;
}

export async function deleteUser(user:userI.User): Promise<boolean> {
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("Delete from Utente where Email = '" + user.email + "'"); //execute the query
        poolConnection.close(); //close connection with database
        return true;
    } catch (e: any) {
        console.error(e);
    }
    return false;
}

export async function change_name(user:userI.User): Promise<boolean> {
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("Update Utente Set Nome = '" + user.nome + "' Where Email = '" + user.email + "'"); //execute the query
        poolConnection.close(); //close connection with database
        return true;
    } catch (e: any) {
        console.error(e);
    }
    return false;
}

export async function change_cognome(user:userI.User): Promise<boolean> {
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("Update Utente Set Cognome = '" + user.cognome + "' Where Email = '" + user.email + "'"); //execute the query
        poolConnection.close(); //close connection with database
        return true;
    } catch (e: any) {
        console.error(e);
    }
    return false;
}

export async function change_email(email_vecchia: string, email_nuova: string): Promise<boolean> {
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("Update Utente Set Email = '" + email_nuova + "' Where Email = '" + email_vecchia + "'"); //execute the query
        poolConnection.close(); //close connection with database
        return true;
    } catch (e: any) {
        console.error(e);
    }
    return false;
}

export async function change_password(user:userI.User): Promise<boolean> {
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("Update Utente Set Password = '" + user.password + "' Where Email = '" + user.email + "'"); //execute the query
        poolConnection.close(); //close connection with database
        return true;
    } catch (e: any) {
        console.error(e);
    }
    return false;
}

export async function get_istituto_info(istitutoID: number): Promise<Istituto.Istituto> {
    let ist: Istituto.Istituto = Istituto.defaultIstituto();
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("select * from Istituto where ID = '" + istitutoID + "'"); //execute the query
        poolConnection.close(); //close connection with database
        resultSet.recordset.forEach(function(row: any) {
            ist = Istituto.assignVals_DB(row);
        });
    } catch (e: any) {
        console.error(e);
    }
    return ist;
}

export async function get_istituti(): Promise<Istituto.Istituto[]> {
    let ists : Istituto.Istituto[] = [];
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("select * from Istituto"); //execute the query
        poolConnection.close(); //close connection with database
        resultSet.recordset.forEach(function(row: any) {
            ists.push(Istituto.assignVals_DB(row))
        });
    } catch (e: any) {
        console.error(e);
    }
    return ists;
}

export async function change_istituto(email: string, ID_istituto: number) {
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("Update Utente Set Istituto_Iscritto = " + ID_istituto + " Where Email = '" + email + "'"); //execute the query
        poolConnection.close(); //close connection with database
        return true;
    } catch (e: any) {
        console.error(e);
    }
    return false;
}

export async function change_ruolo(email: string, ruolo: number) {
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("Update Utente Set Ruolo = " + ruolo + " Where Email = '" + email + "'"); //execute the query
        poolConnection.close(); //close connection with database
        return true;
    } catch (e: any) {
        console.error(e);
    }
    return false;
}

export async function change_classe(email: string, classe: string) {
    try {
        var poolConnection = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("Update Utente Set Classe = '" + classe + "' Where Email = '" + email + "'"); //execute the query
        poolConnection.close(); //close connection with database
        return true;
    } catch (e: any) {
        console.error(e);
    }
    return false;
}