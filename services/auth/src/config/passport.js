import User from "../models/User";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import bcrypt from "bcryptjs";

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
