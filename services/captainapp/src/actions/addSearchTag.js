import {} from "../types";
import axios from "axios";
import {
    variables
} from "../config";
import {
    toast
} from "react-toastify";

export const addSearchTagHandler = async (searchVal) => {
    const searchTagCreateUrl = `${variables.baseUrl}/playlist/searchtag/create`;
    const resultData = (await axios.post(searchTagCreateUrl, {
        searchVal,
    })).data;
    if (resultData.status) {
        return {
            status: true,
            data: resultData.data
        };;
    } else {
        toast.error(resultData.data.toString())
        return {
            status: false,
            data: resultData.data
        };
    }
}