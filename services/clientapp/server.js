const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const app = express();
const logoUrl = 'https://openbeats.nyc3.digitaloceanspaces.com/fallback/logoicon.png';

app.use(morgan("dev"));
app.use(express.static(path.resolve(__dirname, './build')));
app.disable('etag');

// / - landing page
app.get('/', async (request, response) => {
    try {
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/\$OG_TITLE/g, 'OpenBeats');
        result = await result.replace(/\$OG_DESCRIPTION/g, "Unlimited Music For Free!");
        result = await result.replace(/\$OG_IMAGE/g, logoUrl);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});


// /topcharts - all topcharts
app.get('/topcharts', async (request, response) => {
    try {
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/\$OG_TITLE/g, 'TopCharts - OpenBeats');
        result = await result.replace(/\$OG_DESCRIPTION/g, "Enjoy Weekly TopCharts in all the languages for Free, only at OpenBeats!");
        result = await result.replace(/\$OG_IMAGE/g, logoUrl);
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
        let result = await data.replace(/\$OG_TITLE/g, 'Albums - OpenBeats');
        result = await result.replace(/\$OG_DESCRIPTION/g, "Enjoy Unlimited Collection of Albums for Free, only at OpenBeats!");
        result = await result.replace(/\$OG_IMAGE/g, logoUrl);
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
        let result = await data.replace(/\$OG_TITLE/g, 'Latest Albums - OpenBeats');
        result = await result.replace(/\$OG_DESCRIPTION/g, "Enjoy Unlimited Collection of Latest Albums for Free, only at OpenBeats!");
        result = await result.replace(/\$OG_IMAGE/g, logoUrl);
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
        let result = await data.replace(/\$OG_TITLE/g, 'Popular Albums - OpenBeats');
        result = await result.replace(/\$OG_DESCRIPTION/g, "Enjoy Unlimited Collection of Popular Albums for Free, only at OpenBeats!");
        result = await result.replace(/\$OG_IMAGE/g, logoUrl);
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
        let result = await data.replace(/\$OG_TITLE/g, 'Artists - OpenBeats');
        result = await result.replace(/\$OG_DESCRIPTION/g, "Explore Unlimited Artists for Free, only at OpenBeats!");
        result = await result.replace(/\$OG_IMAGE/g, logoUrl);
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
        let result = await data.replace(/\$OG_TITLE/g, 'Languages - OpenBeats');
        result = await result.replace(/\$OG_DESCRIPTION/g, "Explore Unlimited Albums in Unlimited Languages for Free, only at OpenBeats!");
        result = await result.replace(/\$OG_IMAGE/g, logoUrl);
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
        let result = await data.replace(/\$OG_TITLE/g, 'Emotions - OpenBeats');
        result = await result.replace(/\$OG_DESCRIPTION/g, "Explore Music which suits your Emotions for Free, only at OpenBeats!");
        result = await result.replace(/\$OG_IMAGE/g, logoUrl);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

app.get('*', async (request, response) => {
    try {
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        let result = await data.replace(/\$OG_TITLE/g, 'OpenBeats');
        result = await result.replace(/\$OG_DESCRIPTION/g, "Unlimited Music For Free!");
        result = await result.replace(/\$OG_IMAGE/g, logoUrl);
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

/* 

possible routes

/playlist/album/:id - individual album ***
/artist/:id/all - individual artist all albums ***
/artist/:id/releases - individual artist released albums ***
/artist/:id/featuring - individual artist featuring albums ***
/languages/:id - individual language albums ***
/emotions/:id - individual emotion albums ***
/playlist/topchart/:id - individual topchart ***

*/

app.listen(PORT, (err) => {
    if (!err) console.log("Serving client app at port - " + PORT);
    else console.error(err);
})
