const dtf = new Intl.DateTimeFormat('ko-KR', {
	timeZone: 'Asia/Seoul',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false
});

/** 날짜를 KST 기준으로 표시 */
export function formatDateTime(date: Date | string | null | undefined) {
	if (!date) return '-';
	return dtf.format(new Date(date));
}

/** 두 시각 사이 근무시간 표시 (예: 3시간 25분) */
export function formatDuration(start: Date | string | null, end: Date | string | null) {
	if (!start || !end) return '-';
	const minutes = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000);
	if (minutes < 0) return '-';
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

/** 분을 'N시간 M분'으로 표시 */
export function formatMinutes(minutes: number) {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

/** 금액을 '1,000원' 형식으로 표시 */
export function formatWon(n: number) {
	return `${n.toLocaleString('ko-KR')}원`;
}
