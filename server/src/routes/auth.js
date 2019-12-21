import express from "express";
import User from "../models/User";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "config";

const router = express.Router();

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["email", "profile"],
	}),
);

//callback route for google
router.get(
	"/google/callback",
	passport.authenticate("google", { session: false }),
	(req, res) => {
		const payload = { user: req.user };
		jwt.sign(
			payload,
			config.get("jwtSecret"),
			{ expiresIn: 360000 },
			(err, token) => {
				try {
					if (err) throw error;
					res.redirect(302, `http://localhost:3000/#/auth/callback/${token}`);
				} catch (error) {
					res.status(500).json({ error: "Internal Server Error" });
				}
			},
		);
	},
);
router.post("/login", (req, res, next) => {
	passport.authenticate("local", (error, user, info) => {
		if (error) {
			console.error(error.message);
			res.status(500).json({ error: "Internal Server Error" });
		}
		if (info !== undefined) {
			res.status(401).json({ error: info.message });
		} else {
			const payload = { user };
			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 360000 },
				(err, token) => {
					try {
						if (err) throw error;
						res.json({ token });
					} catch (error) {
						res.status(500).json({ error: "Internal Server Error" });
					}
				},
			);
		}
	})(req, res, next);
});
export default router;
