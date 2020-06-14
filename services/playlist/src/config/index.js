const type = "development";
// production or development or staging
let mongoURI =
  "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db-staging"; // development & staging url
if (type === "production") {
  mongoURI =
    "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db"; // production url
}
export const config = {
  baseurl: {
    dev: "http://localhost:2004",
    prod: "http://obs-core:2000",
  },
  baseUrlLink: type === "development" ? "http://localhost:2004" : "http://obs-core:2000",
  mongoURI_DEV: mongoURI,
  jwtSecret: "WeAreAwesome",
  lastFmAPIKey: "d2b6c4283a7958e1d107005ac85d59db",
  spacesAPIKey: "OIZSJZBLSONESEJUQLOT",
  spacesAPISecret: "srzc9w3eaFplkd8mkUQrobqOqCxmvr2hcB8RPrpmIMk",
  dummyMusicHolder: "https://openbeats.nyc3.digitaloceanspaces.com/fallback/dummy_music_holder.jpg",
  isDev: type === "development" ? true : false,
  subFolder: type === "production" ? "production" : "staging",
};