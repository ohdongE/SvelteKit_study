<script lang="ts">
	import { resolve } from '$app/paths';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const home: Record<string, '/admin' | '/leader' | '/worker'> = {
		ADMIN: '/admin',
		LEADER: '/leader',
		WORKER: '/worker'
	};
</script>

<nav>
	{#if data.user}
		{#if home[data.user.role]}
			<a href={resolve(home[data.user.role])}>홈</a>
		{/if}
		<span>{data.user.name}님 ({data.user.role})</span>
		<form method="POST" action="/logout" style="display:inline">
			<button type="submit">로그아웃</button>
		</form>
	{:else}
		<a href={resolve('/login')}>로그인</a>
	{/if}
</nav>

<main>
	{@render children()}
</main>
