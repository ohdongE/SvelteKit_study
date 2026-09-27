<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { formatDateTime, formatDuration } from '$lib/format';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h1>내 출퇴근</h1>
<a href={resolve('/worker/pay')}>내 급여 보기</a>

{#if data.activeRecord}
	<p>근무중 · 출근 {formatDateTime(data.activeRecord.check_in)}</p>
	<form method="POST" action="?/checkOut" use:enhance>
		<button type="submit">퇴근하기</button>
	</form>
{:else}
	<form method="POST" action="?/checkIn" use:enhance>
		<button type="submit">출근하기</button>
	</form>
{/if}

{#if form?.message}
	<p style="color:{form?.success ? 'green' : 'red'}">{form.message}</p>
{/if}

<h2>출근부</h2>
<table>
	<thead>
		<tr><th>출근</th><th>퇴근</th><th>근무시간</th></tr>
	</thead>
	<tbody>
		{#each data.records as r (r.id)}
			<tr>
				<td>{formatDateTime(r.check_in)}</td>
				<td>{r.check_out ? formatDateTime(r.check_out) : '(근무중)'}</td>
				<td>{formatDuration(r.check_in, r.check_out)}</td>
			</tr>
		{:else}
			<tr><td colspan="3">기록이 없습니다.</td></tr>
		{/each}
	</tbody>
</table>
