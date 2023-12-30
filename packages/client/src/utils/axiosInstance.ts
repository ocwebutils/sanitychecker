import axios from "axios";

export const baseAPIURL = process.env.NODE_ENV !== "production" ? "http://localhost:3030/api/v1" : "https://api.ocutils.me/api/v1";

export const axiosInstance = axios.create({
	baseURL: baseAPIURL,
	headers: {
		"Access-Control-Allow-Origin": "*"
	}
});
