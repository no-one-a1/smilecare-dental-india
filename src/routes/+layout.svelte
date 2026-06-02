<script lang="ts">
    let { children } = $props();
</script>

<main class="global-layout-wrapper">
    {@render children?.()}
</main>

<style>
    /* Global browser resets to guarantee uniform scaling across all screen sizes */
    :global(html, body) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow-x: hidden; 
        width: 100%;
        background-color: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    :global(*, *:before, *:after) {
        box-sizing: inherit;
    }

    /* Removes the rigid max-width restriction from the layout layer.
       This allows the middle workspace sections in your +page.svelte 
       to utilize full screen capacity on laptops and desktops!
    */
    .global-layout-wrapper {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
</style>