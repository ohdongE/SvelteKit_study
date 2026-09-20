<script lang="ts">
	import { resolve } from '$app/paths';
	let { children } = $props();
</script>

<div class="container_head">
	<p>header</p>
	<a href={resolve('/login')}>로그인</a>
</div>

<style>
	.container_head{
		display: flex;
	}
</style>
{@render children()}
