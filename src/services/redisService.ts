import IORedis,{Redis} from 'ioredis';
import configration from './../configration';

class RedisService{
    private redis:Redis;
    private DEFAULT_EXPIRE:number=43200;

    constructor(){
        this.redis=new IORedis(configration.REDIS_HOST,{
            port:parseInt(configration.REDIS_PORT),
            password:configration.REDIS_PASSWORD,
            name:configration.REDIS_DB
        });
        this.redis.on('connect',()=>console.info("CONNECTED TO REDIS DB"));
        this.redis.on('disconnect',()=>console.error("DISCONNECTED TO REDIS DB"))
    }

    config():void{
        return; 
    }

    async setValue(key:string,value:JSON,expireInSeconds=this.DEFAULT_EXPIRE):Promise<string>{
        try{
            return await this.redis.set(key,JSON.stringify(value),'EX',expireInSeconds)
        }
        catch(e){
            console.error("REDIS ERROR:",e)
        }
    }

    async getValue(key:string):Promise<any>{
        try{
            return JSON.parse(await this.redis.get(key));
        }
        catch(e){
            console.error("REDIS ERROR:",e)
        }
    }
}

const redisService=new RedisService();
export default redisService;