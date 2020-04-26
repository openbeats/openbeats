export const config = {
    mongoURI_DEV: "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db",
    google: {
        client_id: "2800805513-or82jtgi9ug4bskbftp792o90so12f1d.apps.googleusercontent.com",
        client_secret: "5SsBLfvwqqrs0r1se2Y3noix"
    },
    jwtSecret: "WeAreAwesome",
    saltRound: 10,
    lambda: "https://orvpax9d6b.execute-api.ap-south-1.amazonaws.com/default/obs-core?vid=",
    redis: {
        prod: "obs-redis",
        dev: "localhost"
    },
    isDev: false
}