const type = "development";
// production or development or staging
let mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db-staging"; // development & staging url
if (type === "production") {
	mongoURI = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net/obs-db"; // production url
}

export const config = {
	mongoURI_DEV: mongoURI,
	jwtSecret: "WeAreAwesome",
	saltRound: 10,
	support: {
		email: "openbeatsyag@gmail.com",
		password: "9Ve7nQr4sZDd=5mYW9_r",
	},
	port: {
		dev: 2001,
		prod: 2000,
	},
	root: {
		name: "Openbeats",
		email: "openbeatsyag@gmail.com",
		password: "openbeats@123",
		avatar: "https://openbeats.live/favicon.ico",
	},
	corebaseurl: {
		dev: "http://localhost:3000",
		prod: "http://obs-core:2000",
	},
	isDev: type === "development" ? true : false,
};
