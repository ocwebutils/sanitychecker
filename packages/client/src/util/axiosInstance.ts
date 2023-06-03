import axios from "axios";

const baseAPIURL = process.env.NODE_ENV !== "production" ? "https://api.ocutils.me/api/v1" : "https://api.ocutils.me/api/v1";

export const axiosInstance = axios.create({
	baseURL: baseAPIURL,
	headers: {
		"Access-Control-Allow-Origin": "*"
	}
});
