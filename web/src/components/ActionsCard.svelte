<script lang="ts">
  import Icon from './Icon.svelte'
  import { ICON_EXPORT, ICON_SETTINGS } from '../lib/icons'
  import { t } from '../lib/i18n/index.svelte'

  interface Props {
    onExport: () => void
  }

  let { onExport }: Props = $props()
</script>

<section class="card actions">
  <button type="button" class="action pressable" onclick={onExport} aria-label={t('export')} title={t('export')}>
    <Icon path={ICON_EXPORT} size={40} />
  </button>
  <a class="action pressable" href="#/about" aria-label={t('settings')} title={t('settings')}>
    <Icon path={ICON_SETTINGS} size={40} />
  </a>
</section>

<style>
  .actions {
    display: flex;
    gap: 32px;
    padding: 16px;
  }

  .action {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 4px;
    border-radius: 12px;
    color: var(--color-icon);
  }
</style>
