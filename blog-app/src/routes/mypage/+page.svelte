<script lang="ts">
	let { data } = $props();

    
</script>
<h1>마이페이지</h1>

<p>{data.user?.name}</p>
<p>{data.user?.email}</p>
<p>{data.user?.roles}</p>
<p>{data.user?.created_at}</p>
