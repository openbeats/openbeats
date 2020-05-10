import express from "express";
import User from "../models/User";
import {
	config
} from "../config";
import {
	check,
	validationResult
} from "express-validator";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

const router = express.Router();

router.post(
	"/login",
	[check("email", "Please include a valid email").isEmail(), check("password", "Please enter a password.").exists()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({
				status: false,
				data: errors
					.array()
					.map(ele => `${ele.param} - ${ele.msg} `)
					.join("\n"),
			});
		}
		const {
			email,
			password
		} = req.body;
		try {
			let user = await User.findOne({
				email
			});
			if (!user) {
				return res.json({
					status: false,
					data: "Invalid Credentials"
				});
			}
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.json({
					status: false,
					data: "Invalid Credentials"
				});
			}
			const token = user.generateAuthToken();
			const data = {
				token,
				name: user.name,
				email: user.email,
				id: user.id,
				avatar: user.avatar,
			};
			if (req.query.admin) data["admin"] = user.admin;
			return res.json({
				status: true,
				data,
			});
		} catch (error) {
			console.error(error.message);
			res.send({
				status: false,
				data: "Internal Server Error",
			});
		}
	}
);

router.post(
	"/register",
	[
		check("name", "Name is required").not().isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check("password", "Please enter a password with 6 or more characters").isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({
				status: false,
				data: errors
					.array()
					.map(ele => `${ele.param} - ${ele.msg} `)
					.join("\n"),
			});
		}
		const {
			name,
			email,
			password
		} = req.body;
		try {
			let user = await User.findOne({
				email,
			});
			if (user) {
				return res.send({
					status: false,
					data: "User with that email id already exist",
				});
			}
			const avatar = `https://ui-avatars.com/api/?rounded=true&name=${encodeURIComponent(name.trim())}&bold=true&background=F32C2C&color=FFFFFF`;
			user = new User({
				name,
				email,
				password,
				avatar,
			});
			const salt = await bcrypt.genSalt(config.saltRound);
			user.password = await bcrypt.hash(password, salt);
			await user.save();
			const token = user.generateAuthToken();
			const data = {
				token,
				name: user.name,
				email: user.email,
				id: user.id,
				avatar: user.avatar,
			};
			return res.json({
				status: true,
				data,
			});
		} catch (error) {
			console.error(error.message);
			res.send({
				status: false,
				data: "Internal Server Error",
			});
		}
	}
);

router.post("/forgotpassword", [check("email", "Please include a valid email").isEmail()], async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let msg = "";
			if (errors.errors.length > 0) {
				errors.errors.forEach(element => {
					msg += element.msg + "\n";
				});
			}
			return res.send({
				status: false,
				data: msg,
			});
		}

		const {
			email
		} = req.body;

		const user = await User.findOne({
			email,
		});

		if (!user) {
			return res.send({
				status: false,
				data: "No user exist with that email address.",
			});
		}

		const supportEmail = config.support.email;
		const supportPassword = config.support.password;

		const smtpTransport = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: supportEmail,
				pass: supportPassword,
			},
		});

		let randToken = crypto.randomBytes(20);
		randToken = randToken.toString("hex");

		user.reset_password_token = randToken;
		await user.save();

		const payload = {
			token: randToken,
		};

		const token = jwt.sign(payload, config.jwtSecret, {
			expiresIn: 60 * 60,
		});

		const url = `https://openbeats.live/auth/reset/${token}`;

		const data = {
			to: user.email,
			from: supportEmail,
			template: "forgot-password-email",
			subject: "Password help has arrived!",
			html: `<!DOCTYPE html>
            <html>
            <head>
                <title>Forget Password Email</title>
            </head>
            <body>
                <div>
                    <h3>Dear ${user.name},</h3>
                    <p>You requested
                    for a password reset, kindly use this <a href="${url}"> link </a> to reset your password</p>
                    <br/>
                    <p>Cheers!</p>
                </div>
            </body>
            </html>`,
		};
		setTimeout(function () {
			smtpTransport.sendMail(data, function (err, info) {
				if (err) throw err;
				console.log(info.response);
			});
		}, 0);

		return res.send({
			status: true,
			data: "Kindly check your email for further instructions",
		});
	} catch (error) {
		console.error(error.message);
		return res.send({
			status: false,
			data: "Something went wrong.",
		});
	}
});

router.post("/resetpassword", async (req, res) => {
	try {
		const {
			reset_password_token,
			password
		} = req.body;
		const user = await User.findOne({
			reset_password_token,
		});
		if (!user) {
			return res.send({
				status: false,
				data: "Invalid Link.",
			});
		}
		const salt = await bcrypt.genSalt(config.saltRound);
		user.password = await bcrypt.hash(password, salt);
		user.reset_password_token = "";
		await user.save();
		res.send({
			status: true,
			data: "Password has been reseted successfully.",
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: "Internal Server Error",
		});
	}
});

router.post("/validateresettoken", async (req, res) => {
	try {
		const {
			reset_password_token
		} = req.body;
		const user = await User.findOne({
			reset_password_token,
		});
		if (!user) {
			return res.send({
				status: false,
				data: "Invalid Link.",
			});
		}
		res.send({
			status: true,
			data: "valid token",
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: "Internal Server Error",
		});
	}
});

export default router;