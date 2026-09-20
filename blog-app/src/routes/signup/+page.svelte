<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();

  let emailChecked = $derived(form?.action === 'checkEmail' && form?.exists === false);
</script>

<div class="auth-container">
  <h3>회원가입</h3>

  <form method="POST" action="?/signup" use:enhance>
    <input type="text" name="name" value={form?.name ?? ''} placeholder="이름" required />

    <div class="email-row">
      <input
        type="email"
        name="email"
        value={form?.email ?? ''}
        placeholder="이메일"
        readonly={emailChecked}
        required
      />
      {#if !emailChecked}
        <button type="submit" class="secondary" formaction="?/checkEmail"formnovalidate>중복확인</button>
      {/if}
    </div>

    {#if form?.action === 'checkEmail'}
        {#if typeof form.exists === 'boolean'}
            {#if form.exists}
            <p class="error">이미 사용 중인 이메일입니다</p>
            {:else}
            <p class="success">사용 가능한 이메일입니다</p>
            {/if}
        {:else if form.message}
            <p class="error">{form.message}</p>
        {/if}
    {/if}

    <input type="password" name="password" placeholder="비밀번호" required />

    <button type="submit" disabled={!emailChecked}>회원가입</button>

    {#if form?.action === 'signup' && form?.message}
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
  input:read-only {
    background: #eee;
  }
  .email-row {
    display: flex;
    gap: 8px;
  }
  .email-row input {
    flex: 1;
  }
  button {
    padding: 10px;
    border: none;
    border-radius: 6px;
    background: #333;
    color: #fff;
    font-size: 0.95em;
    cursor: pointer;
  }
  button:hover {
    background: #111;
  }
  button.secondary {
    flex-shrink: 0;
    background: #666;
    padding: 10px 14px;
  }
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  .error {
    margin: 0;
    color: #d33;
    font-size: 0.9em;
  }
  .success {
    margin: 0;
    color: #2a9d4a;
    font-size: 0.9em;
  }
</style>