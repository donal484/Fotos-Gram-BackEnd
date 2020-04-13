import jwt from 'jsonwebtoken'

export default class Token{

    private static seed: string='este-es-el-seed-de-mi-app-secreto';
    private static caducidad: string = '30d';


    constructor(){}

    //recibo el token generado 

    static getJwtToken(payload: any ): string{
        return  jwt.sign({
            usuario: payload},
            this.seed,{expiresIn: this.caducidad})//llave privada
    }

    //Compruebo el token con mi token local
    static comprobarToken(userToken:string){

        return new Promise( (resolve,reject) =>{

            jwt.verify(userToken, this.seed,(err,decoded)=>{
                if(err){
                    reject();
                }else{
                    resolve(decoded);
    
                }
            })

        })

    }
}