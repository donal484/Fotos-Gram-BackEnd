import express from 'express';
export default class Server{

    public app: express.Application;
    public port: number= 3000;

    constructor(){

        this.app = express();
    }

    //creo un metodo que escuche las peticiones que se realicen al puerto

    start(callback: () => void) {
        this.app.listen(this.port, callback);
    }
}
