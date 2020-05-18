const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");

const PORT = process.env.PORT || 2000;
const app = express();

app.use(morgan("dev"));

app.use(express.static(path.resolve(__dirname, './build')));

app.get('*', (request, response) => {
    const filePath = path.resolve(__dirname, './build', 'index.html');
    // read in the index.html file
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log("hits heree................")
        // replace the special strings with server generated strings
        data = data.replace(/\$OG_TITLE/g, 'Home Page');
        data = data.replace(/\$OG_DESCRIPTION/g, "Home page description");
        result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
        response.send(result);
    });

});

app.listen(PORT, (err) => {
    if (!err) console.log("Serving client app at port - " + PORT);
    else console.error(err);
})
