import express from "express";
import { check, validationResult } from "express-validator";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import config from "config";
import User from "../models/User";
import jwt from "jsonwebtoken";
import auth from "../config/auth";

const router = express.Router();

router.post(
	"/register",
	[
		check("name", "Name is required")
			.not()
			.isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check(
			"password",
			"Please enter a password with 6 or more characters",
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "User with that email id already exist" }] });
			}

			const avatar = gravatar.url(email, {
				s: "200",
				r: "pg",
				d: "mm",
			});

			user = new User({
				name,
				email,
				password,
				avatar,
			});
			const salt = await bcrypt.genSalt(config.get("saltRound"));
			user.password = await bcrypt.hash(password, salt);
			await user.save();
			const payload = { user: { id: user.id } };
			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 360000 },
				(err, token) => {
					try {
						if (err) throw err;
						res.json({ token });
					} catch (error) {
						res.status(500).send({ error: "Internal Server Error" });
					}
				},
			);
		} catch (error) {
			console.error(error.message);
			res.status(500).send({ error: "Internal Server Error" });
		}
	},
);

router.get("/me", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
});
export default router;
