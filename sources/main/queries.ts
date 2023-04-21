const sql = require('mssql');

const config = {
    user: 'CloudSA665ece82', // better stored in an app setting such as process.env.DB_USER
    password: 'unibo99@23MLABDL', // better stored in an app setting such as process.env.DB_PASSWORD
    server: 'smartbaguniboserver.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'smartbagDB', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}





export async function query1() {
    try {
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query("select * from Istituto");

        console.log(`${resultSet.recordset.length} rows returned.`);

        // output column headers
        var columns = "";
        for (var column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));

        // ouput row contents from default record set
        var ret = "";
        console.log(resultSet.recordset[0])
        resultSet.recordset.forEach(function(row: any) {
            console.log("tipo: " + typeof row) 
            console.log("%s\t%s\t%s", row.ID, row.Nome, row.Città);
            ret += ("id: " + row.ID + " nome: " +  row.Nome + " città: " + row.Città) + "\n"
        });
        
        poolConnection.close();
        return ret;
    } catch (e: any) {
        console.error(e.message);
    }
}



