const jwt = require('jsonwebtoken');
const bcryptjs= require('bcryptjs');
const conexion = require('../database/db.js');

const {promisify}= require('util');

exports.register = async(req,res)=>{ 
    
    try {
        const name = req.body.name;
        const user = req.body.user;
        const pass = req.body.pass;
    
        const passHash = await bcryptjs.hash(pass, 8); 

        conexion.query('INSERT INTO users SET ?',
            {
                user:user,
                name:name,
                pass:passHash
            },(error,results)=>{
                if(error){
                    console.log(error)
                }else{
                    res.redirect('/login'); 
                }
            }
        );
        
    

    }
    catch (error){
            console.log(error);
    }

}

exports.login = async(req, res)=>{
    try{
        const user = req.body.user;
        const pass = req.body.pass;

        //console.log(`El usuario es ${user} y el pass es ${pass}`)
        if(!user || !pass){
            res.render('login',
            {
                alert:true,
                alertTitle:"Advertencia",
                alertMessage:"Ingrese un usuario y un password",
                alertIcon:"info",
                showConfirmButton: true,
                timer:false,
                ruta:"login"
            })
        }else{
            conexion.query( 'SELECT * FROM users WHERE user = ? ', [user], 
                 async(error,results)=>{ 

                    if( results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))  ){

                        res.render('login',
                        {
                            alert:true,
                            alertTitle:"Error",
                            alertMessage:"Usuario y/o password incorrecto",
                            alertIcon:"error",
                            showConfirmButton: true,
                            timer:false,
                            ruta:"login" 
                        })
                    }
                    else{
                        //inicio de session OK 
                        const id = results[0].id;
                        const token = jwt.sign( { id:id }, process.env.JWT_SECRETO, {
                            expiresIn: process.env.JWT_TIEMPO_EXPIRA
                        })

                        // testear
                        console.log(`El token→ ${token} ...para el usuario ${id}`); 

                        const cookieOptions = {
                            expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 *60 * 60 * 1000),
                            httpOnly: true
                        }

                        res.cookie('jwt', token, cookieOptions);

                        res.render('login', 
                        {
                            alert:true,
                            alertTitle:"CONEXION EXITOSA",
                            alertMessage:"LOGIN CORRECTO",
                            alertIcon:"success",
                            showConfirmButton: false,
                            timer:800,
                            ruta:"" 
                        });
                    }
                }                
            )
        }

    }catch (error){
        console.log(error)
    }
}


exports.idAuthenticated = async ( req, res, next )=>{

    if(req.cookies.jwt){
            try{
                const decodificada = await promisify (jwt.verify) (req.cookies.jwt, process.env.JWT_SECRETO);
                
                conexion.query('SELECT * FROM users WHERE id = ?' , [decodificada.id], 
                    (error, results)=>{
                        // si no es..para el catch
                        if(!results){
                            return next();
                        }
                        else {
                            req.user = results[0];
                                      /* test*/   console.log(results[0]); 
                                                  console.log(req.user); 
                            return next();
                        }
                    }

                );

            }catch(error){
                console.log(error);
            }

    }else{
        res.redirect('/login');

    }
};




exports.logout = (req,res)=>{

    res.clearCookie('jwt');
    return res.redirect('/');
};
 