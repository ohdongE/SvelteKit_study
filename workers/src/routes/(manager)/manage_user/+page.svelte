<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let selectedGroup = $derived(data.groups.find((g) => g.id === data.groupId));
</script>

<h1>사용자 권한 관리</h1>

<form>
	<select
		name="select_group"
		value={data.groupId ? String(data.groupId) : ''}
		onchange={(e) => e.currentTarget.form?.requestSubmit()}
	>
		<option value="">-- 그룹 선택 --</option>
		{#each data.groups as group (group.id)}
			<option value={String(group.id)}>{group.name}</option>
		{/each}
	</select>
	<noscript><button type="submit">조회</button></noscript>
</form>

{#if selectedGroup}
	<p>현재 팀장: {selectedGroup.leader?.name ?? '(없음)'}</p>
{/if}

{#if form?.message}
	<p style="color:{form?.success ? 'green' : 'red'}">{form.message}</p>
{/if}

{#if data.groupId}
	<ul>
		{#each data.users as user (user.id)}
			<li>
				{user.name} ({user.login_id}) - {user.roles.name}

				<form method="POST" action="?/updateWage" use:enhance style="display:inline">
					<input type="hidden" name="user_id" value={user.id} />
					<input
						type="number"
						name="hourly_wage"
						value={user.hourly_wage}
						min="0"
						step="1"
						style="width:7em"
					/>원
					<button type="submit">시급 저장</button>
				</form>

				{#if user.roles.name === 'WORKER' && !selectedGroup?.leader_id}
					<form method="POST" action="?/promoteToLeader" use:enhance style="display:inline">
						<input type="hidden" name="user_id" value={user.id} />
						<input type="hidden" name="group_id" value={user.group_id} />
						<button type="submit">팀장으로 임명</button>
					</form>
				{:else if user.roles.name === 'LEADER'}
					<form method="POST" action="?/demoteToWorker" use:enhance style="display:inline">
						<input type="hidden" name="user_id" value={user.id} />
						<button type="submit">일반 유저로 변경</button>
					</form>
				{/if}
			</li>
		{:else}
			<li>소속된 사용자가 없습니다.</li>
		{/each}
	</ul>
{/if}
