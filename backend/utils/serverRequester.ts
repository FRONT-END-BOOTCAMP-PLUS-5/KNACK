import axios from "axios";

let baseURL = "";

const hostLocal = process.env.NEXT_APP_HOST_LOCAL || "";
const hostDev = process.env.NEXT_APP_HOST_DEV || "";
const hostProd = process.env.NEXT_APP_HOST_PROD || "";

const endpointLocal = process.env.NEXT_APP_API_ENDPOINT_LOCAL || "";
const endpointDev = process.env.NEXT_APP_API_ENDPOINT_DEV || "";
const endpointProd = process.env.NEXT_APP_API_ENDPOINT_PROD || "";

// NODE_ENV는 기본적으로 next에서 설정됨: "development" | "production"
const nodeEnv = process.env.NODE_ENV;

// baseURL 결정
if (nodeEnv === "development") {
    baseURL = endpointDev.startsWith("http")
        ? endpointDev
        : `http://${endpointDev}`;
} else if (nodeEnv === "production") {
    baseURL = endpointProd.startsWith("http")
        ? endpointProd
        : `https://${endpointProd}`;
} else {
    baseURL = endpointLocal.startsWith("http")
        ? endpointLocal
        : `http://${endpointLocal}`;
}

export const serverRequester = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});
