<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>팀장 페이지</h1>
<a href={resolve('/create_user')}>유저 생성</a>

<h2>내 그룹 멤버 {data.group ? `(${data.group.name})` : ''}</h2>
{#if data.group}
	<ul>
		{#each data.members as m (m.id)}
			<li>{m.name} - {m.login_id} ({m.roles.name})</li>
		{/each}
	</ul>
{:else}
	<p>소속된 그룹이 없습니다.</p>
{/if}
