const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

// gets the html content of the playlist page
const puppeteerOperation = async (playlistURL) => {
    try {
        // initializing puppeteer instance
        const browser = await puppeteer.launch({
            executablePath: await chromium.executablePath,
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            headless: chromium.headless
        });
        // navigate to the playlist page
        const page = await browser.newPage();
        // set user agent (override the default headless User Agent)
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        // navigating to playlist page and waiting till the page loads
        await page.goto(playlistURL, {
            waitUntil: "networkidle2"
        });
        // getting html content of the page
        const html = await page.content();
        // close the page
        browser.close();
        // returning the html content
        return html;
    } catch (err) {
        console.log("Error in getting html content " + err);
        return null;
    }
};

exports.handler = async (event) => {

    try {
        const playlistUrl = event.queryStringParameters && event.queryStringParameters.playlisturl ? event.queryStringParameters.playlisturl : null;

        if (playlistUrl !== null) {

            // getting html content from the playlist url
            const htmlContent = await puppeteerOperation(playlistUrl);

            // checking for any mistake in getting html content
            if (htmlContent === null) {
                // sending back response
                return {
                    status: false,
                    error: "Please check playlist url"
                };
            } else {

                // sending back response
                return {
                    status: true,
                    htmlContent: htmlContent
                };
            }
        } else {
            // sending error response
            return {
                status: false,
                error: "No playlist URL recieved at server"
            };
        }
    } catch (err) {

        // sending error response
        return {
            status: false,
            error: "Error in getHTMLContent ",
            desc: err,
        };
    }


};