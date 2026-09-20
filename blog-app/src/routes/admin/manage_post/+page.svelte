<script lang="ts">
  import type { PageProps } from './$types';
  import { formatDate } from '$lib/utils/timeFormat';

  let { data }: PageProps = $props();
</script>

<h1>게시물 관리</h1>

<ul>
  {#each data.posts as post}
    <li class="post-item">
      <div class="post-body">
        <p class="title">{post.title}</p>
        <div class="comment-subbody">
            <p class="time">시각 : {formatDate(post.created_at)}</p>
            <p class="time">작성자 : {post.users.name}</p>
        </div>
      </div>
      <form class = "delete-form" method="POST" action="?/deletePost">
        <input type="hidden" name="postId" value={post.id} />
        <button type="submit">삭제</button>
      </form>
    </li>
  {/each}
</ul>

<style>
  .post-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }
  .title,
  .time {
    margin: 0;
  }
  .comment-subbody{
    display: flex;
    gap: 4px;
  }
  .time {
    font-size: 0.85em;
    color: #888;
  }
  .delete-form button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: #333;
    color: #fff;
    cursor: pointer;
  }
</style>