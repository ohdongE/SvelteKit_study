<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatMinutes, formatWon } from '$lib/format';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const unitLabel = { day: '일급', week: '주급', month: '월급' } as const;
</script>

<h1>내 급여</h1>
<a href={resolve('/worker')}>← 출퇴근</a>

<p>시급: {formatWon(data.hourlyWage)}</p>

<form>
	<select name="unit" value={data.unit} onchange={(e) => e.currentTarget.form?.requestSubmit()}>
		<option value="day">일급</option>
		<option value="week">주급</option>
		<option value="month">월급</option>
	</select>
	{#if data.unit !== 'month'}
		<input
			type="month"
			name="month"
			value={data.month}
			onchange={(e) => e.currentTarget.form?.requestSubmit()}
		/>
	{/if}
	<noscript><button type="submit">조회</button></noscript>
</form>

<table>
	<thead>
		<tr><th>기간</th><th>근무 횟수</th><th>근무시간</th><th>{unitLabel[data.unit]}</th></tr>
	</thead>
	<tbody>
		{#each data.rows as row (row.key)}
			<tr>
				<td>{data.unit === 'week' ? `${row.key} 주` : row.key}</td>
				<td>{row.count}회</td>
				<td>{formatMinutes(row.minutes)}</td>
				<td>{formatWon(row.pay)}</td>
			</tr>
		{:else}
			<tr><td colspan="4">근무 기록이 없습니다.</td></tr>
		{/each}
	</tbody>
	<tfoot>
		<tr>
			<th>합계</th>
			<td>{data.totalCount}회</td>
			<td>{formatMinutes(data.totalMinutes)}</td>
			<td>{formatWon(data.totalPay)}</td>
		</tr>
	</tfoot>
</table>
