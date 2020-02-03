import redis from "redis";
import config from "config";

export default redis.createClient({
    port: 6379,
    host: config.get("redis"),
});