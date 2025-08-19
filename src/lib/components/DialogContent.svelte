<script lang="ts">
  import type { Snippet } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import { Dialog, type WithoutChildrenOrChild } from "bits-ui";
 
  let {
    ref = $bindable(null),
    children,
    ...restProps
  }: WithoutChildrenOrChild<Dialog.ContentProps> & {
    children?: Snippet;
  } = $props();
</script>
 
<Dialog.Content bind:ref {...restProps} forceMount={true}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade={{ duration: 100 }}>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Dialog.Content>