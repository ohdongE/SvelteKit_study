<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();
</script>

<div class="container">
  <h1>새 글 작성</h1>

  <form method="POST" action="?/createPost" use:enhance class="post-form">
    <input type="text" name="title" placeholder="제목" required />
    <input type="text" name="subtitle" placeholder="부제목 (선택)" />
    <textarea name="content" placeholder="내용을 입력하세요" rows="8" required></textarea>
    <button type="submit">작성 완료</button>

    {#if form?.body.message}
      <p class="error-msg">{form.body.message}</p>
    {/if}
  </form>
</div>

<style>
  .container {
    max-width: 600px;
    margin: 40px auto;
    padding: 0 20px;
  }

  .post-form {
    display: flex;
    flex-direction: column;
    gap: 16px; /* 입력 요소 사이 간격 */
  }

  .post-form input,
  .post-form textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 15px;
    box-sizing: border-box;
  }

  .post-form textarea {
    resize: vertical; /* 세로 크기 조절만 허용 */
  }

  .post-form button {
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }

  .post-form button:hover {
    background-color: #0056b3;
  }

  .error-msg {
    color: #d9534f;
    margin: 0;
    font-size: 14px;
  }
</style>