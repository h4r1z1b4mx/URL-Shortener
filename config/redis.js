import dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();

class RedisClient{
    constructor (HOST, PORT, PASSWORD) {
        this.client = createClient({
            username:"default", 
            password:PASSWORD,
            socket: {
                host: HOST, 
                port: PORT, 
            }, 
        });

        this.client.on("connect", () => {
            console.log("Connected to Redis");
        });
        
        this.client.on("ready", () => {
            console.log("Redis is ready");
        });

        this.client.on("end", () => {   
            console.log("Redis connection closed.");
        });

        this.client.on("error", (err) => {
            console.log("Redis Client Error", err);
        });
    }
}


const redisA = new RedisClient(
    process.env.REDIS_HOST1,
    parseInt(process.env.REDIS_PORT1) || 6379,
    process.env.REDIS_PASSWORD1
).client;

const redisB = new RedisClient(
    process.env.REDIS_HOST2,
    parseInt(process.env.REDIS_PORT2) || 6380,
    process.env.REDIS_PASSWORD2
).client;

// Connect both Redis clients
redisA.connect().catch(console.error);
redisB.connect().catch(console.error);

export {redisA, redisB};