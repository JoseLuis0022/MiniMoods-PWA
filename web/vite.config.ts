import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json' with { type: 'json' }

// Ruta base del sitio. Por defecto './' (relativa): el mismo build funciona en la raíz
// del dominio o en cualquier subcarpeta (p. ej. https://sites.imperioon.com/MiniMoods/).
// Para fijar una ruta absoluta: BASE_PATH=/MiniMoods/ npm run build
const base = process.env.BASE_PATH || './'

// https://vite.dev/config/
export default defineConfig({
  base,
  // Accesible desde cualquier equipo de la red local (dev y preview).
  server: { host: true },
  preview: { host: true },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Mini Moods',
        short_name: 'Mini Moods',
        description: 'Registro de ánimo minimalista, sin anuncios y con control total de tus datos.',
        lang: 'es',
        id: './',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FBFBFB',
        theme_color: '#FBFBFB',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})
