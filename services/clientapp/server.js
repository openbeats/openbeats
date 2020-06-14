const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const axios = require("axios").default;
const { infoFetchUrls, logoUrl, realBaseUrl } = require("./serverConfig");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(morgan("dev"));
app.use(express.static(path.resolve(__dirname, './build')));
app.disable('etag');

// /topcharts - all topcharts
app.get('/topcharts', async (request, response) => {
    try {
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, 'TopCharts - OpenBeats');
        result = await result.replace(/Unlimited Music for Free!/g, "Enjoy Weekly TopCharts in all the languages for Free, only at OpenBeats!");
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, logoUrl);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});


// /albums/all - all albums
app.get('/albums/all', async (request, response) => {
    try {
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, 'Albums - OpenBeats');
        result = await result.replace(/Unlimited Music for Free!/g, "Enjoy Unlimited Collection of Albums for Free, only at OpenBeats!");
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, logoUrl);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

// /albums/latest - all latest albums
app.get('/albums/latest', async (request, response) => {
    try {
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, 'Latest Albums - OpenBeats');
        result = await result.replace(/Unlimited Music for Free!/g, "Enjoy Unlimited Collection of Latest Albums for Free, only at OpenBeats!");
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, logoUrl);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

// /albums/popular - all popular albums
app.get('/albums/popular', async (request, response) => {
    try {
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, 'Popular Albums - OpenBeats');
        result = await result.replace(/Unlimited Music for Free!/g, "Enjoy Unlimited Collection of Popular Albums for Free, only at OpenBeats!");
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, logoUrl);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

// /artists - all artists
app.get('/artists', async (request, response) => {
    try {
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, 'Artists - OpenBeats');
        result = await result.replace(/Unlimited Music for Free!/g, "Explore Unlimited Artists for Free, only at OpenBeats!");
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, logoUrl);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

// /languages - all languages
app.get('/languages', async (request, response) => {
    try {
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, 'Languages - OpenBeats');
        result = await result.replace(/Unlimited Music for Free!/g, "Explore Unlimited Albums in Unlimited Languages for Free, only at OpenBeats!");
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, logoUrl);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

// /emotions - all emotions
app.get('/emotions', async (request, response) => {
    try {
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, 'Emotions - OpenBeats');
        result = await result.replace(/Unlimited Music for Free!/g, "Explore Music which suits your Emotions for Free, only at OpenBeats!");
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, logoUrl);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

// /playlist/album/:id - individual album ***
app.get('/playlist/album/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const {
            title,
            description,
            thumbnail
        } = await getAlbumInfo(id);
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, title);
        result = await result.replace(/Unlimited Music for Free!/g, description);
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, thumbnail);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

// /artist/:id/all - individual artist all albums ***
// /artist/:id/releases - individual artist released albums ***
// /artist/:id/featuring - individual artist featuring albums ***
const artistRoutes = ['/artist/:id/all', '/artist/:id/releases', '/artist/:id/featuring'];
app.get(artistRoutes, async (request, response) => {
    try {
        const id = request.params.id;
        const {
            title,
            description,
            thumbnail
        } = await getArtistInfo(id);
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, title);
        result = await result.replace(/Unlimited Music for Free!/g, description);
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, thumbnail);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

// /languages/:id - individual language albums ***
app.get('/languages/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const {
            title,
            description,
            thumbnail
        } = await getLanguageInfo(id);
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, title);
        result = await result.replace(/Unlimited Music for Free!/g, description);
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, thumbnail);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

// /emotions/:id - individual emotion albums ***
app.get('/emotions/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const {
            title,
            description,
            thumbnail
        } = await getEmotionInfo(id);
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, title);
        result = await result.replace(/Unlimited Music for Free!/g, description);
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, thumbnail);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

// /playlist/topchart/:id - individual topchart ***
app.get('/playlist/topchart/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const {
            title,
            description,
            thumbnail
        } = await getTopChartInfo(id);
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, title);
        result = await result.replace(/Unlimited Music for Free!/g, description);
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, thumbnail);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

app.get('/sharesong', async (request, response) => {
    try {
        let title = 'Openbeats', description = "Unlimited Music For Free!", thumbnail = logoUrl, audioSrc = '';
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        const songId = request.query.songid;
        if (songId) {
            const songData = await getSongInfo(songId);
            title = songData.title;
            thumbnail = songData.thumbnail;
            description = songData.description;
            audioSrc = songData.audioSrc;
        }
        let result = await data.replace(/OpenBeats/g, title);
        result = await result.replace(/Unlimited Music for Free!/g, description);
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, thumbnail);
        if (audioSrc) {
            let mainUrl = `${realBaseUrl}/sharesong?songid=${songId}`;
            result = await result.replace(/\$OG_VIDEO/g, mainUrl);
            // result = await result.replace(/\$OG_AUD_TYPE/g, "audio/webm");
        }
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

// common route other than above routes
app.get('*', async (request, response) => {
    try {
        let title = 'Openbeats', description = "Unlimited Music For Free!", thumbnail = logoUrl;
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/OpenBeats/g, title);
        result = await result.replace(/Unlimited Music for Free!/g, description);
        result = await result.replace(/https:\/\/openbeats.nyc3.digitaloceanspaces.com\/fallback\/logoicon.png/g, logoUrl);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

app.listen(PORT, (err) => {
    if (!err) console.info("Serving client app at port - " + PORT);
    else console.error(err);
})


// fetch requests
const getAlbumInfo = async (id) => {
    let title = 'Openbeats', description = "Unlimited Music For Free!", thumbnail = logoUrl;
    try {
        const { data } = await axios.get(`${infoFetchUrls.album}/${id}`);
        if (data.status) {
            title = data.data.name + " - " + title;
            thumbnail = data.data.thumbnail;
        }
    } catch (error) {
        console.error(error.message)
    }
    return {
        title: title,
        description: description,
        thumbnail: thumbnail
    }
}

const getArtistInfo = async (id) => {
    let title = 'Openbeats', description = "Unlimited Music For Free!", thumbnail = logoUrl;
    try {
        const { data } = await axios.get(`${infoFetchUrls.artist}/${id}`);
        if (data.status) {
            title = data.data.name + " - " + title;
            thumbnail = data.data.thumbnail;
        }
    } catch (error) {
        console.error(error.message)
    }
    return {
        title: title,
        description: description,
        thumbnail: thumbnail
    }
}

const getLanguageInfo = async (id) => {
    let title = 'Openbeats', description = "Unlimited Music For Free!", thumbnail = logoUrl;
    try {
        const { data } = await axios.get(`${infoFetchUrls.language}/${id}`);
        if (data.status) {
            title = data.data.name + " - " + title;
            thumbnail = data.data.thumbnail;
        }
    } catch (error) {
        console.error(error.message)
    }
    return {
        title: title,
        description: description,
        thumbnail: thumbnail
    }
}

const getEmotionInfo = async (id) => {
    let title = 'Openbeats', description = "Unlimited Music For Free!", thumbnail = logoUrl;
    try {
        const { data } = await axios.get(`${infoFetchUrls.emotion}/${id}`);
        if (data.status) {
            title = data.data.name + " - " + title;
            thumbnail = data.data.thumbnail;
        }
    } catch (error) {
        console.error(error.message)
    }
    return {
        title: title,
        description: description,
        thumbnail: thumbnail
    }
}

const getTopChartInfo = async (id) => {
    let title = 'Openbeats', description = "Unlimited Music For Free!", thumbnail = logoUrl;
    try {
        const { data } = await axios.get(`${infoFetchUrls.topchart}/${id}`);
        if (data.status) {
            title = data.data.name + " - " + title;
            thumbnail = data.data.thumbnail;
        }
    } catch (error) {
        console.error(error.message)
    }
    return {
        title: title,
        description: description,
        thumbnail: thumbnail
    }
}

const getSongInfo = async (id) => {
    let title = 'Openbeats', description = "Unlimited Music For Free!", thumbnail = logoUrl, audioSrc = '';
    try {
        const { data } = await axios.get(`${infoFetchUrls.song}/${id}?audiosrc=true`);
        if (data.status) {
            title = data.data.title + " - " + title;
            thumbnail = data.data.thumbnail;
            audioSrc = data.data.audioSrc;
        }
    } catch (error) {
        console.error(error.message)
    }
    return {
        title: title,
        description: description,
        thumbnail: thumbnail,
        audioSrc: audioSrc
    }
}