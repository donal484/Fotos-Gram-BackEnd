import { Schema, model, Document} from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema= new Schema({

    nombre:{
        type:String,
        required:[true,'Error insertando el nombre']
    },

    avatar:{
        type:String,
        default:'av-1.png'
    },
    email:{
        type: String,
        unique: true,
        required:[true,'Correo es obligatorio']
    },
    password:{
        type : String,
        required:[true,'La contraseña es necesaria']
    }
});

usuarioSchema.method('compararPassword', function(password:string=''):boolean{

    if(bcrypt.compareSync(password, this.password)){
        return true;
    } else{
        return false;
    }
})


interface Iusuario extends Document{
    nombre:string
    avatar:string
    email:string
    password:string

    compararPassword(password:string): boolean
}


export const Usuario= model<Iusuario>('Usuario',usuarioSchema);

