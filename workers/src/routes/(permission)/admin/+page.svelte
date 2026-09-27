<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<h1>관리자 페이지</h1>
<ul>
	<li><a href={resolve('/create_user')}>사용자 생성</a></li>
	<li><a href={resolve('/manage_user')}>사용자 권한 관리</a></li>
</ul>
