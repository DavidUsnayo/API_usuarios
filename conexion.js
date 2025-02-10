const mysql = require('mysql2');

// Configurar la conexión con un pool
const db = mysql.createPool({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root', 
    password: process.env.MYSQLPASSWORD || '',  
    database: process.env.MYSQLDATABASE || 'registro',
    port: process.env.MYSQLPORT || 3308,
    waitForConnections: true,    //estos ultimos 3 no son esenciales pero mejoran la base de datos
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar conexión
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
        console.log('MYSQLHOST:', process.env.MYSQLHOST);
    } else {
        console.log('✅ Conectado a la base de datos MySQL en Railway');
        connection.release(); // Liberar conexión después de verificar
    }
});

module.exports = { db };
