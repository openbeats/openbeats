import axios from "axios";
import {
	variables
} from "../config";
import {
	toast
} from "react-toastify";


export const addResourceHandler = async (resourceType, resourceId, resourceName, resourceImageUrl, isEdit) => {
	try {
		let resultData = null;
		let resourceEndpoint;
		switch (resourceType) {
			case "Artist":
				resourceEndpoint = `${variables.baseUrl}/playlist/artist/`;
				break;
			case "Language":
				resourceEndpoint = `${variables.baseUrl}/playlist/language/`;
				break;
			case "Emotion":
				resourceEndpoint = `${variables.baseUrl}/playlist/emotion/`;
				break;
			default:
				throw new Error("Invalid Resource Type")
		}
		if (isEdit) {
			resourceEndpoint += `/${resourceId}`;
			resultData = (
				await axios.put(resourceEndpoint, {
					name: resourceName,
					thumbnail: resourceImageUrl,
				})
			).data;
		} else {
			resourceEndpoint += `/create`;
			resultData = (
				await axios.post(resourceEndpoint, {
					name: resourceName,
					thumbnail: resourceImageUrl,
				})
			).data;
		}
		if (resultData.status) {
			const data = {
				status: true,
				data: resultData.data,
			};
			return data;
		} else {
			toast.error(resultData.data.toString());
			const data = {
				status: false,
				data: resultData.data,
			};
			return data;
		}
	} catch (error) {
		toast.error(error.toString());
		const data = {
			status: false,
			data: error.toString(),
		};
		return data;
	}

};