import express from "express";
import User from "../models/User";
import passport from "passport";
import passportStrategy from "../config/passport";

const router = express.Router();

router.get("/token", (req, res) => {
	res.send({ token: req.query.token });
});

router.get("/logout", (req, res) => {
	res.send("Logging out");
});

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
		res.redirect(302, "/auth/token?token=" + req.user.token);
	},
);

export default router;
