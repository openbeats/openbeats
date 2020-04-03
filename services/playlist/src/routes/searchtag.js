import SearchTag from "../models/SearchTag";
import { Router } from "express";

import { check, oneOf, validationResult } from "express-validator";

const router = Router();

router.post("/create", async (req, res) => {
	try {
		let { searchVal } = req.body;
		searchVal = searchVal.toLowerCase();
		const searchtag = new SearchTag({
			searchVal,
		});
		await searchtag.save();
		res.send({
			status: true,
			data: searchtag,
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

router.get(
	"/fetch",
	oneOf([check("tagId").exists(), check("startsWith").exists()]),
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({
					status: false,
					data: "Please provide either tagId or startsWith as query params.",
				});
			}
			const { tagId, startsWith } = req.query;
			if (tagId) {
				const searchTag = await SearchTag.findById(tagId);
				return res.send({
					status: true,
					data: searchTag,
				});
			}
			if (startsWith) {
				const searchTags = await SearchTag.find({
					searchVal: {
						$regex: `^${startsWith}`,
						$options: "i",
					},
				}).limit(10);
				return res.send({
					status: true,
					data: searchTags,
				});
			}
			return res.send({
				status: false,
				data: [],
			});
		} catch (error) {
			console.log(error.message);
			res.send({
				status: false,
				data: error.message,
			});
		}
	},
);

router.put("/:id", async (req, res) => {
	try {
		const { newSearchVal, albumId } = req.body;

		const searchTag = await SearchTag.findById(req.params.id);
		if (newSearchVal) {
			searchTag.searchVal = newSearchVal;
		} else {
			searchTag.albumTags.push(albumId);
		}
		await searchTag.save();
		return res.send({
			status: false,
			data: searchTag,
		});
	} catch (error) {
		console.log(error.message);
		return res.send({
			status: false,
			data: error.message,
		});
	}
});

router.delete("/:id", async (req, res) => {
	try {
		await SearchTag.findByIdAndDelete(req.params.id);
		res.send({
			status: true,
			data: "SearchTag got deleted successfully.",
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

export default router;
