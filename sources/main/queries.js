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


exports.queryIstituto = async function query1() {
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
        resultSet.recordset.forEach(row => {
            console.log("%s\t%s\t%s", row.ID, row.Nome, row.Città);
            ret += ("id: " + row.ID + " nome: " +  row.Nome + " città: " + row.Città) + "\n"
        });
        poolConnection.close();
        return ret;
    } catch (err) {
        console.error(err.message);
    }
}


exports.queryRuolo = async function query2() {
    try {
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query("select * from Ruolo");

        console.log(`${resultSet.recordset.length} rows returned.`);

        // output column headers
        var columns = "";
        for (var column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));

        // ouput row contents from default record set
        var ret = "";
        resultSet.recordset.forEach(row => {
            console.log("%s\t%s", row.ID, row.Ruolo);
            ret +=  ("id: " + row.ID + " ruolo: " +  row.Ruolo) + "\n"
        });
        poolConnection.close();
        return ret;
    } catch (err) {
        console.error(err);
    }
}


