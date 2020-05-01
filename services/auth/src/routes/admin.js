import { Router } from "express";
import rootUser from "../permissions/root";
import adminUser from "../permissions/admin";
import paginationMiddleware from "../config/paginationMiddleware";
import User from "../models/User";

const router = Router();

router.get(
	"/",
	adminUser,
	paginationMiddleware(
		User,
		{},
		{
			_id: true,
			name: 1,
			email: 2,
			avatar: 3,
			date: 4,
			admin: 5,
		}
	),
	async (req, res) => {
		try {
			if (res.pagnationError) throw new Error(res.pagnationError);
			res.send({
				status: true,
				data: res.paginatedResults,
			});
		} catch (error) {
			return res.json({
				status: false,
				data: error.message,
			});
		}
	}
);

router.put("/", adminUser, rootUser, async (req, res) => {
	try {
		const { userId, adminStatus, accessLevel } = req.body;
		if (!userId) throw new Error("Please pass userId,adminStatus,accessLevel");
		const user = await User.findById(userId);
		if (!user) throw new Error("User not found.");
		user.admin.status = adminStatus ? true : false;
		user.admin.accessLevel = accessLevel ? accessLevel : null;
		await user.save();
		return res.json({
			status: true,
			data: "Successfully made changes",
		});
	} catch (error) {
		return res.json({
			status: false,
			data: error.message,
		});
	}
});

export default router;
