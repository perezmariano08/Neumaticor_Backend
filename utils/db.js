const mysql = require('mysql2/promise');  // Asegúrate de estar usando mysql2/promise
const dotenv = require('dotenv');
dotenv.config();



const pool = mysql.createPool({
    connectionLimit: 20,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectTimeout: 60000,  // Tiempo máximo para establecer una conexión
    waitForConnections: true,  // Espera a que haya una conexión disponible si el pool está lleno
});

// Manejo de eventos de conexión
pool.on('connection', function (connection) {
    console.log('DB Connection established');
    
    connection.on('error', function (err) {
        console.error(new Date(), 'MySQL error', err.code);
    });

    connection.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });
});

// Manejo de errores
pool.on('error', (err) => {
    console.error('Database error', err);
    if (err.code === 'ECONNRESET' || err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Conexión perdida. Intentando reconectar...');
        // Puedes agregar lógica para reiniciar o reconectar el pool si es necesario
    } else {
        throw err;
    }
});

module.exports = pool;
