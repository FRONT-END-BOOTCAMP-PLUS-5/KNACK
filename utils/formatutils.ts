// utils/format.ts

export function toDate(v?: string | number | Date | null): Date | null {
    if (v == null) return null
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v
    if (typeof v === 'number') return new Date(v < 1e12 ? v * 1000 : v) // sec or ms
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
}

/** createdAt -> expirationAt 사이 남은 일수로 "D-n" 반환 (없거나 만료면 D-0) */
export function ddayLabel(params: { start?: string | number | Date | null; end?: string | number | Date | null }): string {
    const end = toDate(params.end)
    if (!end) return 'D-0'
    const start = toDate(params.start) ?? new Date()
    const ms = end.getTime() - start.getTime()
    const days = Math.max(0, Math.ceil(ms / 86_400_000)) // 24*60*60*1000
    return `D-${days}`
}

export function formatExpiry(
    v?: string | number | Date,
    opts?: { timeZone?: string } // 예: { timeZone: 'Asia/Seoul' }
): string {
    if (v == null) return ''

    let d: Date
    if (v instanceof Date) d = v
    else if (typeof v === 'number') {
        // 초 단위면 ms로 변환
        d = new Date(v < 1e12 ? v * 1000 : v)
    } else {
        d = new Date(v) // ISO 등 문자열
    }
    if (isNaN(d.getTime())) return ''

    // 특정 타임존 강제 필요하면 옵션 사용 (기본: 브라우저 로컬)
    if (opts?.timeZone) {
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: opts.timeZone,
            year: '2-digit', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false,
        }).formatToParts(d)
        const get = (t: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === t)?.value ?? '00'
        return `${get('year')}/${get('month')}/${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`
    }

    // 로컬 타임존 기준 포맷
    const pad = (n: number) => String(n).padStart(2, '0')
    const yy = String(d.getFullYear()).slice(-2)
    const MM = pad(d.getMonth() + 1)
    const dd = pad(d.getDate())
    const HH = pad(d.getHours())
    const mm = pad(d.getMinutes())
    const ss = pad(d.getSeconds())
    return `${yy}/${MM}/${dd} ${HH}:${mm}:${ss}`
}
