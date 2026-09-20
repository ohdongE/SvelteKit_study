<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageProps } from './$types';
  let { form }: PageProps = $props();
</script>

<div class="auth-container">
  <h3>로그인</h3>

  <form action="?/login" method="POST" use:enhance>
    <input type="email" name="email" placeholder="Email" />
    <input type="password" name="password" placeholder="Password" />
    <button type="submit">로그인</button>
    {#if form?.message}
      <p class="error">{form.message}</p>
    {/if}
  </form>
</div>

<style>
  .auth-container {
    max-width: 360px;
    margin: 60px auto;
    padding: 24px;
  }
  h3 {
    margin: 0 0 20px;
    text-align: center;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  input {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95em;
  }
  button {
    padding: 10px;
    border: none;
    border-radius: 6px;
    background: #333;
    color: #fff;
    font-size: 0.95em;
    cursor: pointer;
    margin-top: 4px;
  }
  button:hover {
    background: #111;
  }
  .error {
    margin: 0;
    color: #d33;
    font-size: 0.9em;
  }
</style>