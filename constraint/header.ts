export const HEADER_TABS = ['추천', '신상', '신발', '랭킹', '럭셔리', '이벤트'] as const;

export const DEFAULT_ACTIVE_TAB = '추천';

export type HeaderTab = typeof HEADER_TABS[number]; 