<script lang="ts">
    import type { PageProps } from './$types';
    import { formatDate } from '$lib/utils/timeFormat'
    let { data }: PageProps = $props();
</script>

<h1>댓글 관리</h1>

<ul>
  {#each data.comments as comment}
    <li class="comment-item">
      <div class="comment-body">
        <p class="content">{comment.content}</p>
        <div class="comment-subbody">
            <p class="time">시각 : {formatDate(comment.created_at)}</p>
            <p class="time">작성자 : {comment.users.name}</p>
        </div>
      </div>
      <form class = "delete-form" method="POST" action="?/deleteComment">
        <input type="hidden" name="commentId" value={comment.id} />
        <button type="submit">삭제</button>
      </form>
    </li>
  {/each}
</ul>

<style>
  .comment-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }
  .content,
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