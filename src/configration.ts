import dotenv from 'dotenv';

class Configration{
    public readonly REDIS_HOST:string;
    public readonly REDIS_PORT:string;
    public readonly REDIS_PASSWORD:string;
    public readonly REDIS_DB:string;
    public readonly REDIS_URI:string;

    constructor(){
        dotenv.config();
        this.REDIS_HOST=process.env.REDIS_HOST;
        this.REDIS_PORT=process.env.REDIS_PORT;
        this.REDIS_PASSWORD=process.env.REDIS_PASSWORD
        this.REDIS_DB=process.env.REDIS_DB;
        this.REDIS_URI=process.env.REDIS_URI
    }

    config():void{
        return;
    }
}

const configration=new Configration();

export default configration;