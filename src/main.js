// Entrypoint do módulo (carregado por <script type="module"> no <head>).
//
// 1) Configura o backend de storage (Supabase, se houver .env) ANTES de a
//    agenda ler os dados. A agenda (script clássico no fim do <body>) espera
//    por `window.__storageReady` antes do primeiro load().
// 2) O registro do service worker (PWA) é injetado automaticamente pelo
//    vite-plugin-pwa (injectRegister: 'auto').

import { initStorageBackend } from './storage.js'

// Client ID do Google (OAuth) — usado pela integração com o Google Agenda.
// Definido na Vercel como VITE_GOOGLE_CLIENT_ID (opcional; sem ele a integração fica inativa).
window.GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

initStorageBackend()
  .catch(err => console.error('[storage] erro ao iniciar backend', err))
  .finally(() => {
    if (typeof window.__resolveStorageReady === 'function') {
      window.__resolveStorageReady()
    }
  })
