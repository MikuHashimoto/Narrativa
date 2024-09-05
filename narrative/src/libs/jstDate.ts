export function getJSTDate() {
    const now = new Date();
    const jstOffset = 9 * 60; // JST は UTC+9 時間
    const utcOffset = now.getTimezoneOffset(); // 現在のタイムゾーンのオフセット（分単位）
    const offset = jstOffset - utcOffset;
    return new Date(now.getTime() + offset * 60 * 1000);
}
