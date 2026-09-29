<script lang="ts">
  import Home from './routes/Home.svelte'
  import About from './routes/About.svelte'

  let hash = $state(location.hash)

  $effect(() => {
    const onChange = () => {
      hash = location.hash
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  })
</script>

{#if hash === '#/about'}
  <About />
{:else}
  <Home />
{/if}
