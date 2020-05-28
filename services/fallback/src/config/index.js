const type = 'development';
// production or development or staging
let mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db-staging"; // development & staging url
if (type === 'production') {
    mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db"; // production url
}

export const config = {
    mongoURI_DEV: mongoURI,
    jwtSecret: "WeAreAwesome",
    saltRound: 10,
    lambda1: "https://orvpax9d6b.execute-api.ap-south-1.amazonaws.com/default/obs-core?vid=",
    lambda2: "https://ujlelgsre1.execute-api.ap-south-1.amazonaws.com/default/obs-ytdl?vid=",
    redis: {
        dev: "localhost",
        prod: "obs-redis"
    },
    isDev: type === 'development' ? true : false

}