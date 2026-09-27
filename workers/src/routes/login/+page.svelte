<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<h1>로그인</h1>

<form method="POST" action="?/login" use:enhance>
	<input type="text" name="login_id" placeholder="아이디" value={form?.login_id ?? ''} required />
	<input type="text" name="phone" placeholder="전화번호 (010-0000-0000)" required />
	<button type="submit">로그인</button>

	{#if form?.message}
		<p style="color:red">{form.message}</p>
	{/if}
</form>
