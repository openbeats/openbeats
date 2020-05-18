const ytdl = require("ytdl-core");

module.exports = async function (context, req) {
    try {
        context.log('JavaScript HTTP trigger function processed a request.');
        const vid = req.query.vid ? req.query.vid : null;
        if (vid) {
            if (ytdl.validateID(vid)) {
                const info = await ytdl.getInfo(vid);
                context.res = {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: info,
                }
            } else {
                context.res = {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: {
                        error: "Please pass a valid video Id."
                    }
                };
            }

        } else {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    error: "Please pass the required query param vid"
                }
            };
        }
    } catch (error) {
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                error: error.message
            }
        };
    }
};