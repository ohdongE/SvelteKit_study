<script lang="ts">
  import { enhance } from '$app/forms';
  let { data } = $props();
</script>

<div class="container">
  <!-- 본문 헤더 & 메인 내용 -->
  <article class="post-card">
    <h1 class="title">{data.post.title}</h1>
    {#if data.post.subtitle}
      <h2 class="subtitle">{data.post.subtitle}</h2>
    {/if}
    <div class="author-info">
      <span>작성자: <strong>{data.post.users.name}</strong></span>
    </div>
    <div class="content">{data.post.content}</div>
  </article>

  <hr class="divider" />

  <!-- 댓글 목록 -->
  {#if data.post.comments.length > 0}
    <section class="comment-section">
      <h3>댓글</h3>
      <ul class="comment-list">
        {#each data.post.comments as comment}
          <li class="comment-item">
            <span class="comment-content">{comment.content}</span>
            <span class="comment-author">- {comment.users.name}</span>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  <!-- 댓글 작성 폼 -->
  <section class="comment-form-section">
    {#if data.user}
      <h3>댓글 작성</h3>
      <form method="POST" action="?/createComment" use:enhance class="comment-form">
        <textarea name="content" placeholder="댓글을 입력하세요" rows="3" required></textarea>
        <button type="submit">작성</button>
      </form>
    {:else}
      <p class="login-notice">댓글을 작성하려면 로그인이 필요합니다</p>
    {/if}
  </section>
</div>

<style>
  /* 레이아웃 컨테이너 (글쓰기 페이지와 동일) */
  .container {
    max-width: 600px;
    margin: 40px auto;
    padding: 0 20px;
  }

  /* 본문 영역 */
  .title {
    font-size: 28px;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 18px;
    color: #666;
    margin-top: 0;
    margin-bottom: 12px;
  }

  .author-info {
    font-size: 14px;
    color: #888;
    margin-bottom: 24px;
  }

  .content {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 24px;
    white-space: pre-wrap; /* 줄바꿈 유지 */
  }

  .divider {
    border: none;
    border-top: 1px solid #eee;
    margin: 30px 0;
  }

  /* 댓글 목록 */
  .comment-section h3,
  .comment-form-section h3 {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .comment-list {
    list-style: none;
    padding: 0;
    margin: 0 0 24px 0;
  }

  .comment-item {
    padding: 10px 12px;
    background-color: #f9f9f9;
    border-radius: 6px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .comment-author {
    color: #777;
    margin-left: 10px;
  }

  /* 댓글 입력 폼 (글쓰기 폼 스타일 통일) */
  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .comment-form textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    resize: vertical;
  }

  .comment-form button {
    align-self: flex-end; /* 버튼만 오른쪽에 배치 (원할 경우 100% 채워도 됨) */
    padding: 8px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }

  .comment-form button:hover {
    background-color: #0056b3;
  }

  .login-notice {
    color: #888;
    font-size: 14px;
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 6px;
    text-align: center;
  }
</style>