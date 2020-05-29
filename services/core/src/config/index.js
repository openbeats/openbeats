const type = "development";
// production or development or staging
let mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db-staging"; //  development & staging url
if (type === "production") {
	mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db"; // production url
}

export const config = {
	mongoURI_DEV: mongoURI,
	authBaseUrl: {
		dev: "http://localhost:2001",
		prod: "http://obs-auth:2000",
	},
	playlistBaseUrl: {
		dev: "http://localhost:2000",
		prod: "http://obs-playlist:2000",
	},
	jwtSecret: "WeAreAwesome",
	saltRound: 10,
	redis: {
		dev: "localhost",
		prod: "obs-redis",
	},
	lambda1: "https://orvpax9d6b.execute-api.ap-south-1.amazonaws.com/default/obs-core?vid=",
	lambda2: "https://ujlelgsre1.execute-api.ap-south-1.amazonaws.com/default/obs-ytdl?vid=",
	port: {
		dev: 2004,
		prod: 2000,
	},
	isDev: type === "development" ? true : false,
};