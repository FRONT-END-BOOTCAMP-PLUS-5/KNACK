interface DaumPostcode {
    new(options: {
        oncomplete: (data: KakaoPostcodeData) => void;
    }): {
        open: () => void;
    };
}

declare global {
    interface Window {
        daum: {
            Postcode: DaumPostcode;
        };
    }
}

interface KakaoPostcodeData {
    zonecode: string
    roadAddress: string
    jibunAddress: string
    buildingName: string
    apartment: string // 'Y' or 'N'
    addressType: 'R' | 'J'
}

export const openKakaoPostcode = (
    onComplete: (addr: { full: string; zipCode: string }) => void
) => {
    new window.daum.Postcode({
        oncomplete: function (data: KakaoPostcodeData) {
            let fullAddress = ''

            if (data.addressType === 'R') {
                // 도로명 주소
                fullAddress = data.roadAddress

                if (data.buildingName && data.apartment === 'Y') {
                    fullAddress += ` (${data.buildingName})`
                }
            } else {
                // 지번 주소
                fullAddress = data.jibunAddress
            }

            onComplete({
                full: fullAddress,
                zipCode: data.zonecode,
            })
        },
    }).open()
}


