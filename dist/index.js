"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const post_1 = __importDefault(require("./routes/post"));
const server = new server_1.default();
//Bodyparser - funcion que procesa y prepara el objeto
//toma la informacion de un posteo y lo prepara como un json para mandarlo al modelo
server.app.use(body_parser_1.default.urlencoded({ extended: true })); //recibir peticiones en xwwrfromurlencoder desd angular
server.app.use(body_parser_1.default.json());
//FileUplload, toma los archivos y los pone en una seccion espcecial conocido como Files
server.app.use(express_fileupload_1.default());
//configurar CORSE
server.app.use(cors_1.default({ origin: true, credentials: true }));
//Rutas de mi app
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
//Conectar dB
//uso paquete de Mongoose
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) {
        throw err;
    }
    console.log('Base de datos ONLINE');
});
//levantar express
server.start(() => {
    console.log(`servidor corriendo en el puerto: ${server.port} `);
});
