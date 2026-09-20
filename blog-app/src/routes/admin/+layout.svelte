<script lang="ts">
  import type { LayoutProps } from './$types';
  import { resolve } from '$app/paths';
  let { data, children }: LayoutProps = $props();
</script>

<div class="admin-container">
  <nav class="admin-nav">
    <h2>Admin</h2>
    <ul>
        {#if data.user?.roles === "POST_ADMIN" || data.user?.roles === "SUPER_ADMIN"}
            <li><a href={resolve('/admin/manage_post')}>게시물 관리</a></li>
        {/if}

        {#if data.user?.roles === "COMMENT_ADMIN" || data.user?.roles === "SUPER_ADMIN"}
            <li><a href={resolve('/admin/manage_comment')}>댓글 관리</a></li>
        {/if}

        {#if data.user?.roles === "SUPER_ADMIN"}
            <li><a href={resolve('/admin/manage_user')}>사용자 관리</a></li>
        {/if}

        {#if !data.user}
            <li>권한 없음</li>
        {/if}
    </ul>
  </nav>
  <main class="admin-content">
    {@render children()}
  </main>
</div>

<style>
  .admin-container {
    display: flex;
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 16px;
    gap: 32px;
  }

  .admin-nav {
    flex: 0 0 160px;
  }
  .admin-nav h2 {
    margin: 0 0 12px;
    font-size: 1.1em;
  }
  .admin-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .admin-nav li {
    margin-bottom: 4px;
  }
  .admin-nav a {
    display: block;
    padding: 8px 10px;
    border-radius: 6px;
    text-decoration: none;
    color: #333;
  }
  .admin-nav a:hover {
    background: #f2f2f2;
  }

  .admin-content {
    flex: 1;
    min-width: 0;
    padding-left: 24px;
    border-left: 1px solid #eee;
  }

  
</style>