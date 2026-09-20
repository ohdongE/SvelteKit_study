<script lang="ts">
  import { resolve } from '$app/paths';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<div class="container">
  <h1>"{data.query}" 검색 결과</h1>

  {#if data.posts.length === 0}
    <p class="empty">검색 결과가 없습니다.</p>
  {:else}
    <ul class="post-list">
      {#each data.posts as post}
        <li>
          <a href={resolve('/posts/[id]', { id: String(post.id) })}>
            <p class="title">{post.title}</p>
            <p class="author">{post.users.name}</p>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .container {
    max-width: 640px;
    margin: 0 auto;
    padding: 24px 16px;
  }

  .empty {
    color: #888;
  }

  .post-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .post-list li {
    border-bottom: 1px solid #eee;
  }
  .post-list a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 4px;
    text-decoration: none;
    color: inherit;
  }
  .post-list a:hover {
    background: #fafafa;
  }
  .title {
    margin: 0;
    font-weight: 500;
  }
  .author {
    margin: 0;
    font-size: 0.85em;
    color: #888;
  }
</style>