import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const baseURL = (() => {
    if (typeof window === 'undefined') return ''
    const { host } = window.location

    if (host.includes(process.env.NEXT_APP_HOST_LOCAL ?? '')) {
        return process.env.NEXT_APP_API_ENDPOINT_LOCAL ?? ''
    } else if (host === process.env.NEXT_APP_HOST_DEV) {
        return process.env.NEXT_APP_API_ENDPOINT_DEV ?? ''
    } else {
        return process.env.NEXT_APP_API_ENDPOINT_PROD ?? ''
    }
})()

const requester: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
})

// ✅ Access Token 요청 인터셉터
requester.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (token) config.headers.Authorization = `Bearer ${token}`
    if (config.data instanceof FormData) delete config.headers['Content-Type']
    return config
})

// ✅ 401 응답 처리 (토큰 갱신)
requester.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response?.status === 401 && typeof window !== 'undefined') {
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
                try {
                    const res = await axios.post(`${baseURL}/api/auth/refresh`, { refreshToken })
                    const newAccessToken = res.data.accessToken
                    localStorage.setItem('accessToken', newAccessToken)
                    err.config.headers.Authorization = `Bearer ${newAccessToken}`
                    return requester.request(err.config)
                } catch {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    window.location.href = '/login'
                }
            } else {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
            }
        }
        return Promise.reject(err)
    }
)

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

export default requester
