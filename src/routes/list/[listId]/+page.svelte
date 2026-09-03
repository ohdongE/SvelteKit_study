<script>
    import { page } from '$app/state'
	import { resolve } from '$app/paths';
    const listId = page.params.listId;
    const reviews = [1,2,3,4,5];
</script>

<h1>목록 {listId} 의 페이지</h1>

<h3>- 리뷰 목록</h3>
<ul>
    {#each reviews as item (item)}
        <li>
            <a href={resolve('/list/[listId]/reviews/[reviewsId]', { listId : String(listId) ,reviewsId : String(item) })}>
                {item}
            </a>
        </li>
    {/each}
</ul>

