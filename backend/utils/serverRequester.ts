import axios from "axios";

const endpointLocal = process.env.NEXT_APP_API_ENDPOINT_LOCAL || "";

// baseURL이 http로 시작하지 않으면 자동으로 붙이기
const baseURL = endpointLocal.startsWith("http")
    ? endpointLocal
    : `http://${endpointLocal}`;

export const serverRequester = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});
