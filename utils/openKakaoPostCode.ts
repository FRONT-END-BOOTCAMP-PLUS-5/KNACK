declare global {
    interface Window {
        daum: any
    }
}

export function openKakaoPostcode(onComplete: (addr: string) => void) {
    new window.daum.Postcode({
        oncomplete: function (data: any) {
            const fullAddr = data.address; // 도로명 또는 지번
            onComplete(fullAddr);
        },
    }).open()
}