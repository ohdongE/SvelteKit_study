<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h1>사용자 생성</h1>

<form method="POST" action="?/createUser" use:enhance>
	<input
		type="text"
		name="name"
		placeholder="이름"
		value={form?.name ?? ''}
		maxlength="10"
		required
	/>
	<input
		type="text"
		name="login_id"
		placeholder="로그인 ID (영문이름+소속코드)"
		value={form?.login_id ?? ''}
		maxlength="100"
		required
	/>
	<input
		type="text"
		name="phone"
		placeholder="전화번호 (010-0000-0000)"
		value={form?.phone ?? ''}
		maxlength="20"
		required
	/>

	{#if data.user?.role === 'ADMIN'}
		<select name="group_id" required>
			<option value="">-- 그룹 선택 --</option>
			{#each data.groups as group (group.id)}
				<option value={String(group.id)}>{group.name}</option>
			{/each}
		</select>
	{:else}
		<span>소속: {data.groups[0]?.name ?? '(그룹 없음)'}</span>
	{/if}

	<button type="submit">생성</button>

	{#if form?.message}
		<p style="color:red">{form.message}</p>
	{/if}
	{#if form?.success}
		<p style="color:green">생성 완료되었습니다.</p>
	{/if}
</form>
