const type = 'development';

// production or development or staging
let mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db-staging"; // development & staging url
if (type === 'production') {
  mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db"; // production url
}


export const config = {
  urls: {
    topcharts: "http://obs-playlist:2000/topcharts/inittopcharts"
  },
  mongoURI_DEV: mongoURI,
  lastFmAPIKey: "d2b6c4283a7958e1d107005ac85d59db",
  isDev: type === 'development' ? true : false
}