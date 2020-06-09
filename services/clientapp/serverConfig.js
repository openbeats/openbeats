const { deploymentType } = require("./src/config");
const baseUrl = deploymentType === "development" ? "https://staging-api.openbeats.live/playlist" : "http://obs-playlist:2000";

module.exports = {
    baseUrl: baseUrl,
    isDev: deploymentType === "development" ? true : false,
    logoUrl: 'https://openbeats.nyc3.digitaloceanspaces.com/fallback/logoicon.png',
    infoFetchUrls: {
        album: `${baseUrl}/metadata/album`,
        artist: `${baseUrl}/metadata/artist`,
        emotion: `${baseUrl}/metadata/emotion`,
        language: `${baseUrl}/metadata/language`,
        topchart: `${baseUrl}/metadata/topchart`
    }
}; 