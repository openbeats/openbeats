const { deploymentType } = require("./src/config");
const baseUrl = deploymentType === "development" ? "http://obs-playlist:2000" : "http://obs-playlist:2000";

module.exports = {
    baseUrl: baseUrl,
    isDev: deploymentType === "development" ? true : false,
    logoUrl: 'https://openbeats.nyc3.digitaloceanspaces.com/fallback/logoicon.png',
    infoFetchUrls: {
        album: `${baseUrl}/playlist/metadata/album`,
        artist: `${baseUrl}/playlist/metadata/artist`,
        emotion: `${baseUrl}/playlist/metadata/emotion`,
        language: `${baseUrl}/playlist/metadata/language`,
        topchart: `${baseUrl}/playlist/metadata/topchart`
    }
}; 