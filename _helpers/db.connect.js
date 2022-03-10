let mysql = require('mysql2');
const config = require('config.json');

    
const { host, port, user, password, database } = config.database;
// const connection = await mysql.createConnection({ host, port, user, password });
connection = mysql.createConnection({host,port,user,password,database});

// connect to the MySQL server
connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    } else {
        return console.log("Connected to MySQL Server");
    }
});

module.exports = connection
