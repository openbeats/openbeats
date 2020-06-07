const type = 'development';
// production or development or staging
let mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db-staging"; // development & staging url
if (type === 'production') {
    mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db"; // production url
}
let ytdlLambdaURL = "https://ujlelgsre1.execute-api.ap-south-1.amazonaws.com/default/obs-ytdl?vid="
if (type === 'production') {
    ytdlLambdaURL = "https://7axob3orc3.execute-api.ap-south-1.amazonaws.com/default/obsytdl?vid="
}

export const config = {
    mongoURI_DEV: mongoURI,
    jwtSecret: "WeAreAwesome",
    saltRound: 10,
    ytdlLambda: ytdlLambdaURL,
    redis: {
        dev: "localhost",
        prod: "obs-redis"
    },
    isDev: type === 'development' ? true : false

}