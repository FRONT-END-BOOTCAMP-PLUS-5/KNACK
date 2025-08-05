import requester from "@/utils/requester"

export const STORAGE_PATHS = {
    USER_PROFILE: 'uploads/user/profile',
    PRODUCT: {
        THUMBNAIL: 'uploads/product/thumbnail',
        SLIDER: 'uploads/product/slider',
        DETAIL: 'uploads/product/detail',
    },
}

export const fetchPresignedImageUrl = async (key: string): Promise<string> => {
    const res = await requester.get('/api/upload/', { params: { key } })
    console.log(res);
    return res.data.url
}
