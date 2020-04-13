import { Router, Response, Request} from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Post } from "../models/post.model";
import { Usuario } from "../models/user.model";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../classes/file-system";



const postRoutes= Router();
const fileSystem= new FileSystem();

//OBTENER POST PAGINADOS

postRoutes.get('/',async (req:any, res:Response)=>{

    let pagina= Number(req.query.pagina) || 1;
    let skip = pagina-1;
    skip= skip*10
    const posts= await Post.find()
    .sort({_id:-1})
    .skip(skip)
    .limit(10)
    .populate('usuario','-password')
    .exec()

    res.json({
        ok:true,
        pagina,
        posts
    })

})




//CREAR POST
postRoutes.post('/',[verificaToken],(req:any,res: Response)=> {

    const body = req.body;
    body.usuario = req.usuario._id;

    const imagenes= fileSystem.imagenesDeTempHAciaPost(req.usuario._id);
    body.imgs = imagenes

    Post.create(body).then( async postDB =>{

            await postDB.populate('usuario','-password').execPopulate();//regresa una promesa
        res.json({
            ok:true,  
            post:postDB
        });
        
    
    })
    .catch(err=>{
        res.json({
            err
        })
    })

    


});



//SErvicio para suvbir archivos
//con esto se pueden subir cualquier tipo de archivos, en esta ocacion lo rstringiremos a solo imagenes
postRoutes.post('/upload',[verificaToken],async(req:any,res:Response)=>{

    //hacemos validaciones
    if(!req.files){
        return res.status(400).json({
            ok:false,
            mesaje: 'No se subio ningun archivo'
        });
    }

    const file:FileUpload = req.files.image;

    if(!file){
        return res.status(400).json({
            ok:false,
            mensaje:'No se subio ningun archivo - image'
        });
    }

    if(!file.mimetype.includes('image')){

        return res.status(400).json({
            ok:false,
            mensaje: 'Lo que subio no es una imagen'
        });
    }

    await fileSystem.guardarImagenTemporal(file,req.usuario._id);

    res.json({
        ok:true,
        file: file.mimetype
    })

})


postRoutes.get('/imagen/:userid/:img',(req: any, res: Response)=>{

        const userId = req.params.userid;
        const img= req.params.img;

        const pathFoto= fileSystem.getFotoUrl(userId, img);



        res.sendFile(pathFoto);

});

export default postRoutes;