<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatMinutes, formatWon } from '$lib/format';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>그룹 급여</h1>
<a href={resolve('/leader')}>← 팀장 페이지</a>

<form>
	<input
		type="month"
		name="month"
		value={data.month}
		onchange={(e) => e.currentTarget.form?.requestSubmit()}
	/>
	<noscript><button type="submit">조회</button></noscript>
</form>

<table>
	<thead>
		<tr
			><th>이름</th><th>아이디</th><th>시급</th><th>근무 횟수</th><th>근무시간</th><th>월급</th></tr
		>
	</thead>
	<tbody>
		{#each data.members as m (m.id)}
			<tr>
				<td>{m.name}</td>
				<td>{m.login_id}</td>
				<td>{formatWon(m.hourlyWage)}</td>
				<td>{m.count}회</td>
				<td>{formatMinutes(m.minutes)}</td>
				<td>{formatWon(m.pay)}</td>
			</tr>
		{:else}
			<tr><td colspan="6">멤버가 없습니다.</td></tr>
		{/each}
	</tbody>
	<tfoot>
		<tr>
			<th colspan="4">합계</th>
			<td>{formatMinutes(data.totalMinutes)}</td>
			<td>{formatWon(data.totalPay)}</td>
		</tr>
	</tfoot>
</table>
