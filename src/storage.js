// ─────────────────────────────────────────────────────────────
// Backend de storage para o app.
//
// O app original (agenda) foi escrito para o ambiente Claude, que
// expõe `window.storage` com a API assíncrona:
//
//   await window.storage.get(key, shared)      -> { value } | null
//   await window.storage.set(key, value, shared)
//   await window.storage.delete(key, shared)
//   await window.storage.list(shared)          -> { keys: [...] }
//
// O `shared=true` significa "compartilhado com toda a equipe".
//
// Em index.html já existe um polyfill inline que aponta `window.storage`
// para o localStorage (funciona offline, por dispositivo). Este módulo
// roda DEPOIS e, se houver credenciais do Supabase, troca o backend dos
// dados compartilhados (shared:true) para o Supabase — mantendo a mesma
// API e o localStorage como fallback offline.
// ─────────────────────────────────────────────────────────────

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const TABLE = import.meta.env.VITE_SUPABASE_TABLE || 'agenda_store'

export async function initStorageBackend () {
  // `local` = o polyfill de localStorage já instalado pelo index.html.
  const local = window.storage

  if (!URL || !KEY) {
    console.info('[storage] Supabase não configurado — usando localStorage (somente este dispositivo).')
    return
  }

  // import dinâmico: só baixa o SDK do Supabase se ele for realmente usado.
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(URL, KEY)

  window.storage = {
    async get (key, shared) {
      if (!shared) return local.get(key, shared)
      try {
        const { data, error } = await supabase
          .from(TABLE).select('value').eq('key', key).maybeSingle()
        if (error) throw error
        return data ? { value: data.value } : null
      } catch (e) {
        console.warn('[storage] get falhou — usando cópia local', e)
        return local.get(key, shared)
      }
    },

    async set (key, value, shared) {
      const v = typeof value === 'string' ? value : JSON.stringify(value)
      // sempre guarda uma cópia local (offline-first)
      await local.set(key, v, shared)
      if (!shared) return { ok: true }
      try {
        const { error } = await supabase
          .from(TABLE).upsert({ key, value: v, shared: true }, { onConflict: 'key' })
        if (error) throw error
        return { ok: true }
      } catch (e) {
        console.warn('[storage] set falhou (offline?) — salvo só localmente', e)
        return { ok: false, offline: true }
      }
    },

    async delete (key, shared) {
      await local.delete(key, shared)
      if (!shared) return { ok: true }
      try {
        const { error } = await supabase.from(TABLE).delete().eq('key', key)
        if (error) throw error
      } catch (e) {
        console.warn('[storage] delete falhou', e)
      }
      return { ok: true }
    },

    async list (shared) {
      if (!shared) return local.list(shared)
      try {
        const { data, error } = await supabase.from(TABLE).select('key')
        if (error) throw error
        return { keys: (data || []).map(r => r.key) }
      } catch (e) {
        console.warn('[storage] list falhou — usando local', e)
        return local.list(shared)
      }
    }
  }

  console.info('[storage] Supabase conectado — dados da equipe sincronizados na nuvem.')
}
