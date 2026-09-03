<script lang="ts">
    import { page } from '$app/state';
    const { listId, reviewsId } = page.params;
</script>

<h1>목록 {listId} 의 {reviewsId} 번 리뷰</h1>
