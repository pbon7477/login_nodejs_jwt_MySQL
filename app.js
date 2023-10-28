const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express();

//setear motor de plantillas
app.set('view engine','ejs');

//setear la carpeta para los archivos estaticos
app.use(express.static('public'));

//prosesar los datos
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//setear carpeta para las variables de entorno
dotenv.config({path:'./env/.env'});

//setear las cookies
app.use(cookieParser());

app.use('/',require('./routes/router.js'));



//codigo para eliminar el cache para que no se pueda volver  con el boton de back del navegador luego de hacer el logout
app.use(function(req, res, next) {
    if (!req.user) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    }
    next();


    
  });


app.listen(3000,()=>{
    console.log('SERVER UP ON http://localhost:3000');
})