import passport from "passport";
import googleStrategy from "passport-google-oauth20";
import config from "config";
import User from "../models/User";
import jwt from "jsonwebtoken";

const googleclientID = config.get("google").client_id;
const clientSecret = config.get("google").client_secret;

passport.use(
	new googleStrategy(
		{
			//options for strategy
			callbackURL: "/auth/google/callback",
			clientID: googleclientID,
			clientSecret: clientSecret,
		},
		async (accessToken, refreshToken, profile, done) => {
			const email = profile["_json"].email;
			try {
				let user = await User.findOne({ email });
				if (user) {
					const payload = {
						user: {
							id: user.id,
						},
					};
					jwt.sign(
						payload,
						config.get("jwtSecret"),
						{ expiresIn: 360000 },
						(err, token) => {
							if (err) throw err;
							done(null, { token });
						},
					);
				} else {
					const name = profile["_json"].name;
					const avatar = profile["_json"].picture;
					user = new User({
						name,
						email,
						avatar,
					});
					await user.save();
					const payload = {
						user: {
							id: user.id,
						},
					};
					jwt.sign(
						payload,
						config.get("jwtSecret"),
						{ expiresIn: 360000 },
						(err, token) => {
							if (err) throw err;
							done(null, { token });
						},
					);
				}
			} catch (error) {
				res.status(400);
				done(null, false, { message: "Not a valid token" });
				console.error(error.message);
			}
		},
	),
);
