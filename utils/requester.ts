import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const endpointLocal = process.env.NEXT_APP_API_ENDPOINT_LOCAL || ''

const baseURL = endpointLocal.startsWith('http')
    ? endpointLocal
    : `http://${endpointLocal}`

const requester: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
})

// ✅ FormData일 경우 Content-Type 제거 (자동 처리용)
requester.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type']
    }
    return config
})

// ✅ 간단한 get/post/filePost 함수

export async function get<T = unknown>(url: string, params?: object): Promise<T> {
    const config: AxiosRequestConfig = { params }
    const res: AxiosResponse<T> = await requester.get(url, config)
    return res.data
}

export async function post<T = unknown>(url: string, data?: object): Promise<T> {
    const res: AxiosResponse<T> = await requester.post(url, data)
    return res.data
}

export async function filePost<T = unknown>(url: string, formData: FormData): Promise<T> {
    const res: AxiosResponse<T> = await requester.post(url, formData)
    return res.data
}

export async function filePut(url: string, file: File): Promise<void> {
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`S3 upload failed: ${res.status} - ${err}`)
    }
}

export default requester
