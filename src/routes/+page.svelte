<h1>main page</h1>

<script lang="ts">
    import { resolve } from '$app/paths';
</script>
  
<a href={resolve('/about')}>about</a>
<a href={resolve('/profile')}>profile</a>
<a href={resolve('/list')}>list</a>