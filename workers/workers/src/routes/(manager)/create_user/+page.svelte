<script lang="ts">
	import { enhance } from '$app/forms';
    import type { PageProps } from './$types'
    let {data, form}: PageProps = $props();

</script>
<h1>사용자 생성 페이지</h1>
<form method="POST" action="?/createUser" use:enhance>
    <input type="text" name="input_name" placeholder="이름" required>
    <input type="text" name="input_id" placeholder="아이디(영문이름+소속코드)" required>
    <input type="text" name="input_pw" placeholder="전화번호" required>
    
    <select name="select_group" disabled={data.user?.role === 'LEADER'}>
        {#each data.groups as group (group.id)}
            <option value={group.id}>{group.name}</option>
        {/each}
    </select>

    <button type="submit">생성</button>
    {#if (form?.message)}
        <p>{form.message}</p>
    {/if}
</form>