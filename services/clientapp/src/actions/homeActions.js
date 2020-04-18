import axios from "axios";
import {
    variables
} from "../config";

export const fetchTopCharts = async () => {
    try {
        let metaData = [];
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/topcharts/metadata`)
        metaData = data.allcharts
        return metaData
    } catch (error) {
        console.error(error)
        return [];
    }
}