import User from "../models/User";
import bcrypt from "bcryptjs";
import { config } from "./";
export default async () => {
	try {
		let user = await User.findOne({ email: config.root.email });
		if (!user) {
			let password = config.root.password;
			const salt = await bcrypt.genSalt(config.saltRound);
			password = await bcrypt.hash(password, salt);
			const rootUser = {
				name: config.root.name,
				email: config.root.email,
				password: password,
				avatar: config.root.avatar,
				admin: { status: true, accessLevel: 3 },
			};
			user = new User(rootUser);
			await user.save();
		}
	} catch (error) {
		console.error(error.message);
	}
};
