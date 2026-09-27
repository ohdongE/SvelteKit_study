const dtf = new Intl.DateTimeFormat('ko-KR', {
	timeZone: 'Asia/Seoul',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false
});

/** 서버/클라이언트 타임존과 무관하게 KST로 표시 */
export function formatDateTime(date: Date | string | null | undefined) {
	if (!date) return '-';
	return dtf.format(new Date(date));
}

/** 두 시각 사이의 근무 시간 (예: 3시간 25분) */
export function formatDuration(start: Date | string | null, end: Date | string | null) {
	if (!start || !end) return '-';
	const minutes = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000);
	if (minutes < 0) return '-';
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}
