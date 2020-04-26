export const config = {
    mongoURI_DEV: "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db",
    jwtSecret: "WeAreAwesome",
    saltRound: 10,
    lambda: "https://orvpax9d6b.execute-api.ap-south-1.amazonaws.com/default/obs-core?vid=",
    redis: {
        dev: "localhost",
        prod: "obs-redis"
    },
    isDev: false
}