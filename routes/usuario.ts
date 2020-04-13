import { Router, Request, Response } from "express";
import { Usuario } from "../models/user.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { verificaToken } from "../middlewares/autenticacion";


const userRoutes = Router();


/* userRoutes.get('/prueba', (req: Request,res:Response)=> {

    res.json({
        ok:true,
        mensaje: 'Todo funciona bien!'
    })

}); */
//Login
userRoutes.post('/login',(req:Request, res:Response)=>{
    const body = req.body;

    Usuario.findOne({email: body.email}, 
        (err, userDB )=>{
            if(err) throw err;
            if(!userDB){
                return res.json({
                ok:false,
                mensaje:'Usuario/contraseña No son validos'
            });
            }

            if(userDB.compararPassword( body.password)){

                const tokenUser = Token.getJwtToken({
                    _id: userDB.id,
                    nombre: userDB.nombre,
                    email: userDB.email,
                    avatar: userDB.avatar
                });

                res.json({
                    ok:true,
                    token: tokenUser
                });
            }else{
                return res.json({
                    ok:false,
                mensaje:'Usuario/contraseña No son validos***'
                });
            }

        })

    const login={
        email:body.email,
        password:body.password
    }

})


//Creamos usuario
userRoutes.post('/create',(req: Request, res:Response)=>{

    //esta informacion viene del post
  const user={
      nombre: req.body.nombre,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password,10),
      avatar: req.body.avatar
  }
    //extraer informacion del posteo
    Usuario.create(user).then( userDB=>{
        const tokenUser = Token.getJwtToken({
            _id: userDB.id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok:true,
            token: tokenUser
        });
        
    } )

    .catch( err=>{
        res.json({
            ok:false,
            err
        })
    } )

        

})



userRoutes.post('/update',verificaToken,(req:any, res:Response)=>{

    const user ={
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    Usuario.findByIdAndUpdate(req.usuario._id, user, {new:true},(err,userDB)=>{
        if(err) throw err;

        if(!userDB){
            return res.json({
                ok:false,
                mensaje: 'No existe un usuario con ese ID'

            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB.id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok:true,
            token: tokenUser
        });


    })



});

userRoutes.get('/',[verificaToken],(req: any, res:Response)=>{

    const usuario= req.usuario;
    res.json({
        ok:true,
        usuario
    })
});

export default userRoutes;
