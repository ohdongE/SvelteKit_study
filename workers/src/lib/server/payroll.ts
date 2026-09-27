const KST_OFFSET = 9 * 60 * 60 * 1000;

export type PayUnit = 'day' | 'week' | 'month';

/** 급여 단위(day/week/month)인지 확인 */
export function isPayUnit(v: string | null): v is PayUnit {
	return v === 'day' || v === 'week' || v === 'month';
}

/** 'YYYY-MM' 형식인지 확인 */
export function isMonth(v: string | null): v is string {
	return !!v && /^\d{4}-(0[1-9]|1[0-2])$/.test(v);
}

const pad = (n: number) => String(n).padStart(2, '0');

/** 현재 KST 기준 'YYYY-MM' */
export function currentMonth(now = new Date()) {
	const k = new Date(now.getTime() + KST_OFFSET);
	return `${k.getUTCFullYear()}-${pad(k.getUTCMonth() + 1)}`;
}

/** KST 기준 해당 달의 [start, end) (UTC Date) */
export function monthRange(month: string) {
	const [y, m] = month.split('-').map(Number);
	return {
		start: new Date(Date.UTC(y, m - 1, 1) - KST_OFFSET),
		end: new Date(Date.UTC(y, m, 1) - KST_OFFSET)
	};
}

/** 출근 시각(KST) 기준 구간 키 (주 단위는 그 주 월요일) */
function periodKey(checkIn: Date, unit: PayUnit) {
	const k = new Date(checkIn.getTime() + KST_OFFSET);
	const y = k.getUTCFullYear();
	const m = k.getUTCMonth();
	const d = k.getUTCDate();

	if (unit === 'month') return `${y}-${pad(m + 1)}`;
	if (unit === 'day') return `${y}-${pad(m + 1)}-${pad(d)}`;

	const dow = (k.getUTCDay() + 6) % 7;
	const monday = new Date(Date.UTC(y, m, d - dow));
	return `${monday.getUTCFullYear()}-${pad(monday.getUTCMonth() + 1)}-${pad(monday.getUTCDate())}`;
}

/** 출퇴근 사이 근무 분 */
export function workedMinutes(checkIn: Date, checkOut: Date) {
	return Math.max(0, Math.floor((checkOut.getTime() - checkIn.getTime()) / 60000));
}

/** 시급 × 분 / 60, 원 단위 버림 */
export function calcPay(minutes: number, hourlyWage: number) {
	return Math.floor((hourlyWage * minutes) / 60);
}

type AttendanceLike = { check_in: Date | null; check_out: Date | null };

export type PayRow = { key: string; count: number; minutes: number; pay: number };

/** 퇴근 완료 기록을 단위별로 묶어 근무시간·급여 합계 계산 */
export function summarizePay(records: AttendanceLike[], hourlyWage: number, unit: PayUnit) {
	const map = new Map<string, PayRow>();

	for (const r of records) {
		if (!r.check_in || !r.check_out) continue;

		const key = periodKey(r.check_in, unit);
		const minutes = workedMinutes(r.check_in, r.check_out);
		const row = map.get(key) ?? { key, count: 0, minutes: 0, pay: 0 };

		row.count += 1;
		row.minutes += minutes;
		row.pay += calcPay(minutes, hourlyWage);
		map.set(key, row);
	}

	const rows = [...map.values()].sort((a, b) => b.key.localeCompare(a.key));

	return {
		rows,
		totalCount: rows.reduce((s, r) => s + r.count, 0),
		totalMinutes: rows.reduce((s, r) => s + r.minutes, 0),
		totalPay: rows.reduce((s, r) => s + r.pay, 0)
	};
}
