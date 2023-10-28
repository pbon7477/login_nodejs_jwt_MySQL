const mysql = require('mysql');

const conexion = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    port:process.env.DB_PORT
});

conexion.connect((error)=>{
    if(error){
        console.log('El error de conección es: '+ error);
        return;
    }
    console.log('CONEXION A LA BASE DE DATOS MySQL EXITOSA!!')
});

module.exports = conexion;

