const type = 'development';
// production or development or staging

let mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db"; // production url
if (type === 'staging') {
  mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db-staging"; // production url
}



export const config = {
  mongoURI_DEV: mongoURI,
  authbaseurl: {
    dev: "http://localhost:2001",
    prod: "http://obs-auth:2000"
  },
  jwtSecret: "WeAreAwesome",
  saltRound: 10,
  redis: {
    dev: "localhost",
    prod: "obs-redis"
  },
  lambda: "https://orvpax9d6b.execute-api.ap-south-1.amazonaws.com/default/obs-core?vid=",
  port: {
    dev: 2004,
    prod: 2000
  },
  isDev: type === 'development' ? true : false
}