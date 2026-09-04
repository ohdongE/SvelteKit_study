<script lang="ts">
    import { resolve } from '$app/paths';
  
    const items = [1, 2, 3, 4];
  </script>
  
  <h1>list page</h1>
  
  <ul>
    {#each items as item (item)}
      <li>
        <a href={resolve('/list/[listId]', { listId: String(item) })}>
          {item}
        </a>
      </li>
    {/each}
  </ul>