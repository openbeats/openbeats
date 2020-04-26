const type = 'development';
// production or development or staging

let mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db"; // production url
if (type === 'staging') {
    mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db-staging"; // production url
}

export const config = {
    mongoURI_DEV: mongoURI,
    jwtSecret: "WeAreAwesome",
    saltRound: 10,
    lambda: "https://orvpax9d6b.execute-api.ap-south-1.amazonaws.com/default/obs-core?vid=",
    redis: {
        dev: "localhost",
        prod: "obs-redis"
    },
    isDev: type === 'development' ? true : false

}