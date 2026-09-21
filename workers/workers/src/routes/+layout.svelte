<script lang="ts">
  	import type { LayoutProps } from './$types';
	import { resolve } from '$app/paths';
  	let { data, children }: LayoutProps = $props();
</script>

<nav>
  {#if data.user}
    <span>{data.user.name}님 ({data.user.role})</span>
    <form method="POST" action="/logout">
      <button type="submit">로그아웃</button>
    </form>
  {:else}
    <a href={resolve('/login')}>로그인</a>
  {/if}
</nav>

{@render children()}