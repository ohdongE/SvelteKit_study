<script lang="ts">
  import { resolve } from '$app/paths';
  import type { LayoutProps } from './$types';

  let { data, children }: LayoutProps = $props();
</script>

<header class="navbar">
  <nav class="nav-container">
    <div class="nav-left">
      <a href={resolve('/')} class="logo">Home</a>
      {#if data.user}
        <a href={resolve('/posts/new')}>글쓰기</a>
        {#if data.user?.roles === 'SUPER_ADMIN' || data.user?.roles === 'POST_ADMIN' || data.user?.roles === 'COMMENT_ADMIN'}
          <a href={resolve('/admin')}>관리자 페이지</a>
        {/if}
      {/if}
    </div>

    <div class="nav-right">
      {#if data.user}
        <div class="user-info">
          <span class="user-name">{data.user.name}</span>
          <span class="user-role">({data.user?.roles})</span>
          <a href={resolve('/mypage')} class="logout-btn">마이페이지</a>
        </div>
        <form method="POST" action="/logout">
          <button type="submit" class="logout-btn">로그아웃</button>
        </form>
      {:else}
        <a href={resolve('/login')} class="login-btn">로그인</a>
        <a href={resolve('/signup')} class="signup-btn">회원가입</a>
      {/if}
    </div>
  </nav>
</header>

<main>
  {@render children()}
</main>

<style>
  .navbar {
    width: 100%;
    border-bottom: 1px solid #eee;
    background-color: #ffffff;
  }

  .nav-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-left,
  .nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .nav-left a,
  .nav-right a {
    text-decoration: none;
    color: #333;
    font-size: 14px;
    font-weight: 500;
  }

  .nav-left a:hover,
  .nav-right a:hover {
    color: #004182;
  }

  .logo {
    font-weight: bold !important;
    font-size: 16px !important;
  }

  .user-info {
    font-size: 14px;
    display: flex;
    gap: 4px;
  }

  .user-name {
    font-weight: 600;
    color: #333;
  }

  .user-role {
    color: #888;
    font-size: 12px;
  }

  .logout-btn, .signup-btn, .login-btn {
    background: none;
    border: 1px solid #ddd;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    color: #666;
    cursor: pointer;
  }

  .logout-btn,.signup-btn,.login-btn:hover {
    background-color: #f5f5f5;
    color: #333;
  }

</style>