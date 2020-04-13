
import {Schema, Document, model} from 'mongoose';


const postSchema= new Schema({

    created:{
        type: Date
    },
    mensaje:{
        type:String
    },
    imgs: [{
        type: String
    }],
    coords:{
        type: String
    },
    usuario:{
        type: Schema.Types.ObjectId, //el tipo debemos mantener la relacion con la colección de usuarios
        ref:'Usuario',
        required:[true, 'Debe existir una referencia a un usuario']
    }

});
// es estilo un trigger
postSchema.pre<IpPost>('save', function(next){ //creamos la fecha de forma automatica cuando se genera el posteo, antes de la insercion
    this.created = new Date();
    next();
})

interface IpPost extends Document{
    created: Date;
    Mensaje: string;
    img: string[];
    coords: string;
    usuario: string;
}

export const Post = model<IpPost>('Post', postSchema);