const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");

const PORT = process.env.PORT || 2000;
const app = express();

app.use(morgan("dev"));

app.use(express.static(path.resolve(__dirname, './build')));

app.get('*', async (request, response) => {
    try {
        const filePath = path.resolve(__dirname, './build', 'index.html');
        const data = fs.readFileSync(filePath, { encoding: "utf8" });
        console.log("hits heree................", data)
        let result = await data.replace(/\$OG_TITLE/g, 'Home Page');
        result = await result.replace(/\$OG_DESCRIPTION/g, "Home page description");
        result = await result.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
        response.send(result);
    } catch (error) {
        response.send(error.message);
    }
});

app.listen(PORT, (err) => {
    if (!err) console.log("Serving client app at port - " + PORT);
    else console.error(err);
})
