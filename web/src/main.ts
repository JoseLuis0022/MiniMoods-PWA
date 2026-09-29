import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { applyDocumentLocale } from './lib/i18n/index.svelte'
import { applyTheme } from './lib/theme.svelte'

applyDocumentLocale()
applyTheme()

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
