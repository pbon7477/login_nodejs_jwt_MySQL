const express = require('express');
const router = express.Router();

//invocamos al controlador
const authController = require('../controllers/authControllers.js');



//router para las vistas 
router.get('/', authController.idAuthenticated, (req,res)=>{
    res.render('index.ejs', { user : req.user } )
});

router.get('/login',(req,res)=>{
    res.render('login.ejs', { alert : false })
});

router.get('/register',(req,res)=>{
    res.render('register.ejs')
});

//router para los metodos del controller
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;