import { createClient } from "redis";

let redisClient = null;

export const connectRedis = async () => {
    try {
        const url = process.env.REDIS_URL;

        redisClient = createClient({
            url,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 5) {
                        console.error("Redis: max reconnection attempts reached");
                        return new Error("Max retries");
                    }
                    return Math.min(retries * 200, 2000);
                },
            },
        });

        redisClient.on("error", (err) => console.error("Redis Error:", err));
        redisClient.on("reconnecting", () => console.log("Redis reconnecting..."));

        await redisClient.connect();

        console.log("Redis connected");
    } catch (err) {
        console.error("Redis connection failed:", err.message);
        throw err;
    }
};

export const getRedisClient = () => {
    if (!redisClient || !redisClient.isOpen) {
        throw new Error("Redis not initialized or disconnected");
    }
    return redisClient;
};