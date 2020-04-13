import Server from './classes/server';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'

import cors from 'cors';

import userRoutes from './routes/usuario';
import postRoutes from './routes/post';

const server = new Server();

//Bodyparser - funcion que procesa y prepara el objeto
//toma la informacion de un posteo y lo prepara como un json para mandarlo al modelo
server.app.use(bodyParser.urlencoded({extended:true}));//recibir peticiones en xwwrfromurlencoder desd angular
server.app.use(bodyParser.json());


//FileUplload, toma los archivos y los pone en una seccion espcecial conocido como Files
server.app.use(fileUpload())

//configurar CORSE

server.app.use(cors({ origin: true, credentials:true}))

//Rutas de mi app

server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

//Conectar dB
//uso paquete de Mongoose
mongoose.connect( 'mongodb://localhost:27017/fotosgram',
                { useNewUrlParser:true, useCreateIndex:true},(err)=>{

            if(err){
                throw err;
            }
            console.log('Base de datos ONLINE')
                })



//levantar express
server.start(() => {
    console.log(`servidor corriendo en el puerto: ${server.port} `)
});
