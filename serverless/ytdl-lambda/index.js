const ytdl = require("ytdl-core");

exports.handler = async (event) => {
    const vid = event.queryStringParameters && event.queryStringParameters.vid ? event.queryStringParameters.vid : null;
    if (!vid) {
        const response = {
            statusCode: 200,
            body: JSON.stringify("vid not found"),
        };
        return response;
    }

    console.log(vid)
    const info = await ytdl.getInfo(vid)
    const response = {
        statusCode: 200,
        body: JSON.stringify(info),
    };
    return response;
};