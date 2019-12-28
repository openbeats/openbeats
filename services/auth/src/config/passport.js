import config from "config";
import User from "../models/User";
import passport from "passport";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import { Strategy as localStrategy } from "passport-local";
import bcrypt from "bcryptjs";

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
				if (!user) {
					const name = profile["_json"].name;
					const avatar = profile["_json"].picture;
					user = new User({
						name,
						email,
						avatar,
					});
					await user.save();
				}
				return done(null, {
					id: user.id,
				});
			} catch (error) {
				console.error(error.message);
				return done(null, false, { message: "Cannot login using google" });
			}
		},
	),
);

passport.use(
	new localStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			session: false,
		},
		async (email, password, done) => {
			try {
				const user = await User.findOne({ email });
				if (!user) {
					return done(null, false, {
						message: "Invalid Credentials.",
					});
				}
				const passwordValid = await bcrypt.compare(password, user.password);
				if (!passwordValid) {
					return done(null, false, {
						message: "Invalid Credentials.",
					});
				}
				return done(null, {
					id: user.id,
				});
			} catch (error) {
				return done(error);
			}
		},
	),
);
