// 📁 backend/utils/serverRequester.ts
import axios, { AxiosRequestConfig } from 'axios'

const endpointLocal = process.env.NEXT_APP_API_ENDPOINT_LOCAL || ''
const baseURL = endpointLocal.startsWith('http') ? endpointLocal : `http://${endpointLocal}`
const tossSecretKey = process.env.TOSS_SECRET_KEY!

export const serverRequester = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * POST 요청 (기본 + Toss 타입 대응)
 * @param url API endpoint
 * @param body 요청 바디
 * @param type 'default' | 'toss'
 */
export const serverPost = async <T = any>(
    url: string,
    body: any,
    type: 'default' | 'toss' = 'default'
): Promise<T> => {
    const config: AxiosRequestConfig = {}

    if (type === 'toss') {
        config.baseURL = 'https://api.tosspayments.com/v1'
        config.headers = {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(`${tossSecretKey}:`).toString('base64')}`,
        }
    }

    const response = await serverRequester.post<T>(url, body, config)
    return response.data
}
