import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icon.svg', 'favicon.ico'],
      manifest: {
        name: 'FLOOW Gestão',
        short_name: 'FLOOW Gestão',
        description: 'Sistema de gestão da equipe FLOOW Digital',
        lang: 'pt-BR',
        theme_color: '#f5b400',
        background_color: '#0a0a0b',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // permite que a página funcione offline (cache do app shell)
        navigateFallback: '/index.html'
      },
      devOptions: {
        // Service worker desligado em `npm run dev` para evitar cache agressivo.
        // A instalação/PWA é testável com `npm run build && npm run preview`.
        enabled: false
      }
    })
  ]
})
