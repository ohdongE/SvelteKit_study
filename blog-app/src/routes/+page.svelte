<script lang="ts">
  import { resolve } from '$app/paths';
  import { formatDate } from '$lib/utils/timeFormat';

  let { data } = $props();
</script>

<div class="container">
  <h1>블로그</h1>

  <form action="/search" class="search-form">
    <input type="text" name="q" placeholder="검색어 입력" />
    <button type="submit">검색</button>
  </form>

  <ul class="post-list">
    {#each data.posts as post}
      <li>
        <a href={resolve('/posts/[id]', { id: String(post.id) })}>
          <p class="title">{post.title}</p>
          <p class="time">{formatDate(post.created_at)}</p>
        </a>
      </li>
    {/each}
  </ul>
</div>

<style>
  .container {
    max-width: 640px;
    margin: 0 auto;
    padding: 24px 16px;
  }

  .search-form {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
  }
  .search-form input {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
  .search-form button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: #333;
    color: #fff;
    cursor: pointer;
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
  .time {
    margin: 0;
    font-size: 0.85em;
    color: #888;
  }
</style>