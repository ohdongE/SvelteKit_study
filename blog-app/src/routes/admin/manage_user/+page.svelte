<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<h1>user manage</h1>

{#each data.users as user}
    <form method="POST" action="?/updateRole">
        <span>{user.name}</span>
        <input type="hidden" name="userId" value={user.id} />
        <select name="roleId" value={user.role_id}>
        {#each data.roles as role}
            <option value={role.id}>{role.name}</option>
        {/each}
        </select>
        <button type="submit">변경</button>
    </form>
{/each}