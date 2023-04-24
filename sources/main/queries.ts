import sql, { config } from 'mssql';
import * as userI from './interfaces/User';

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





export async function query1() {
    try {
        var poolConnection: sql.ConnectionPool = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("select * from Istituto"); //execute the query

        // output column headers
        var columns: string = "";
        for (var column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));

        // ouput row contents from default record set
        var ret: string = "";
        resultSet.recordset.forEach(function(row: any) {
            console.log("%s\t%s\t%s", row.ID, row.Nome, row.Città);
            ret += ("id: " + row.ID + " nome: " +  row.Nome + " città: " + row.Città) + "\n"
        });
        
        poolConnection.close(); //close connection with database
        return ret; //return back all the found values
    } catch (e: any) {
        console.error(e.message);
    }
}

export async function findUserWithEmail(email: String): Promise<userI.User> {
    let user: userI.User = userI.defaultUser();
    try {
        var poolConnection: sql.ConnectionPool = await sql.connect(conf); //connect to the database
        var resultSet:sql.IResult<any> = await poolConnection.request()
                                        .query("select * from Utente where Email = '" + email + "'"); //execute the query
        poolConnection.close(); //close connection with database
        // ouput row contents from default record set
        resultSet.recordset.forEach(function(row: any) {
            user = userI.assignVals_JSON(row);
        });
    } catch (e: any) {
        console.error(e.message);
    }
    return user; //return back all the found values
}

