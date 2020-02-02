import redis from "redis";

export default redis.createClient({
    port: 6379,
    host: 'obs-redis',
});