<script lang="ts">
  interface Props {
    path: string
    size?: number
    color?: string
  }

  let { path, size = 24, color = 'currentColor' }: Props = $props()
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  aria-hidden="true"
  focusable="false"
  style:color={color}
>
  <path d={path} fill="currentColor" />
</svg>

<style>
  svg {
    display: block;
    flex-shrink: 0;
    transition: color 0.2s ease;
  }
</style>
