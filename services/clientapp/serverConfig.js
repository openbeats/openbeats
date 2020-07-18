const { deploymentType } = require("./src/config");
const baseUrl = deploymentType === "development" ? "http://localhost/playlist" : "http://obs-playlist:2000";

module.exports = {
    baseUrl: baseUrl,
    isDev: deploymentType === "development" ? true : false,
    logoUrl: 'https://openbeats.nyc3.digitaloceanspaces.com/fallback/logoicon.png',
    infoFetchUrls: {
        album: `${baseUrl}/metadata/album`,
        artist: `${baseUrl}/metadata/artist`,
        emotion: `${baseUrl}/metadata/emotion`,
        language: `${baseUrl}/metadata/language`,
        topchart: `${baseUrl}/metadata/topchart`,
        song: `${baseUrl}/metadata/song`,
    },
    realBaseUrl: deploymentType === "development" ? "http://localhost:3000" : "https://openbeats.live"
}; 