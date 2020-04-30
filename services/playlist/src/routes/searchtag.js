import SearchTag from "../models/SearchTag";
import { Router } from "express";
import { check, oneOf, validationResult } from "express-validator";
import paginationMiddleware from "../config/paginationMiddleware";

const router = Router();

//Search Creation
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

//Fetch search tag by Id or startsWith
router.get("/fetch", oneOf([check("tagId").exists(), check("startsWith").exists()]), async (req, res) => {
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
			if (!searchTag) throw new Error("Search tag not found.");
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
});

//Get all searchTag Tag(page and limit required)
router.get("/all", paginationMiddleware(SearchTag), async (req, res) => {
	try {
		if (!res.paginatedResults) {
			let data = "No searchtags found...";
			if (res.pagnationError) {
				data = res.pagnationError;
			}
			throw new Error(data);
		}
		res.send({
			status: true,
			data: res.paginatedResults,
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

//updates searchTag
router.put("/:id", async (req, res) => {
	try {
		const { searchVal } = req.body;
		const searchTag = await SearchTag.findById(req.params.id);
		if (!searchVal) {
			throw new Error("searchVal is required.");
		}
		searchTag.searchVal = searchVal;
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

//Delete searchTag
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
