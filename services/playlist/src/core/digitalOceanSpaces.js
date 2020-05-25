import {
	config
} from "../config";
import axios from "axios";
const {
	S3,
	Endpoint
} = require("aws-sdk");
//Image Compression Required Library
import imagemin from "imagemin";
import mozjpeg from "imagemin-mozjpeg";
import sharp from "sharp";
import isJpg from "is-jpg";

const ACCESS_KEY = config.spacesAPIKey;
const SECRET_KEY = config.spacesAPISecret;
const spacesEndpoint = new Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new S3({
	endpoint: spacesEndpoint,
	accessKeyId: ACCESS_KEY,
	secretAccessKey: SECRET_KEY,
});

//Resize Image and sends as Buffer
const resizeImage = async (input, width, height) => (sharp(input).resize(width, height)).toBuffer();

//Input Buffer => Output JPEG Buffer
const convertToJpg = async (input) => {
	if (isJpg(input)) {
		return input;
	}
	return sharp(input)
		.jpeg()
		.toBuffer();
};

//Uploads to assert to Digital Ocean and updates assert reference
export const saveAsserts = async (assert, assertId, url, assertModel, property) => {
	try {

		//Fetches Image as Image Buffer
		const response = await axios.get(`${url}`, {
			responseType: "arraybuffer",
		});

		//If ouput is not Image Buffer Throws Error
		if (!(Buffer.isBuffer(response["data"]))) {
			throw new Error("Url given can't be converted as Image Buffer");
		}

		//Resize Image to 300*300
		const content = await resizeImage(response["data"], 300, 300);

		//Reduces Quality
		const miniBuffer = await imagemin.buffer(content, {
			plugins: [convertToJpg, mozjpeg({
				quality: 70
			})]
		});

		//Set Up File Config
		const fileconfig = {
			Bucket: "openbeats",
			Key: `${config.subFolder}/${assert}/${assertId}.jpeg`,
			ACL: "public-read",
			Body: miniBuffer,
		};

		//Uploads file
		const uploadandNotify = new Promise((resolve, reject) =>
			s3.putObject(fileconfig, (err, data) =>
				err ?
				reject(err) :
				resolve(
					`${spacesEndpoint.protocol}//${fileconfig.Bucket}.${spacesEndpoint.host}/${fileconfig.Key}`
				)
			)
		);

		//Gets Endpoint of Image Uploaded and updates assert property
		const endpoint = await uploadandNotify
			.then(endpoint => endpoint)
			.catch(err => {
				throw err;
			});
		if (endpoint) {
			const update = {};
			update[property] = endpoint;
			await assertModel.findByIdAndUpdate(assertId, update);
		} else {
			throw new Error("Couldn't get endpoint..")
		}
	} catch (error) {
		const errUpdate = {};
		errUpdate[property] = config.dummyMusicHolder;
		await assertModel.findByIdAndUpdate(assertId, errUpdate);
		console.error(error);
	}
};


//To delete assert Images when object is deleted
export const deleteAssert = async url => {
	const searchVal = "com/";
	const fileconfig = {
		Bucket: "openbeats",
		Key: url.slice(url.indexOf(searchVal) + searchVal.length),
	};
	try {
		const deleteandNotify = new Promise((resolve, reject) =>
			s3.deleteObject(fileconfig, function (err, data) {
				if (err) reject(err);
				// error
				else resolve("Successfully Deleted"); // deleted
			})
		);
		await deleteandNotify
			.then(msg => console.log(msg))
			.catch(err => {
				throw err;
			});
	} catch (error) {
		console.log(error);
	}
};