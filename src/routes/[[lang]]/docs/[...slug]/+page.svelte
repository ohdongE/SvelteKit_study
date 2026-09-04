<script lang="ts">
    import { page } from '$app/state'
    const Id = page.params.slug;
    const slugArr = String(Id).split('/');

    const lang : string = page.params.lang ?? "ko";
</script>

{#if lang === 'ko'}
    <h1>제목 : {slugArr[0]}</h1>
    <h3>소제목 : {slugArr[1]}</h3>
{:else if lang === 'en'}
    <h1>Title : {slugArr[0]}</h1>
    <h3>SubTitle : {slugArr[1]}</h3>
{/if}
