# Agenda FLOOW Digital

Agenda de entregas da equipe FLOOW Digital — app web instalável (**PWA**), feito com **Vite** (vanilla JS, sem framework).

- **Front-end:** Vite → deploy na **Vercel**
- **Back-end (opcional):** **Supabase** (dados compartilhados da equipe)
- **Código:** **GitHub**
- **Instalável:** PWA (adicionar à tela inicial / instalar no desktop)

> 📦 **Quer publicar para a equipe inteira na nuvem?** Siga o guia passo a passo
> sem precisar instalar nada: **[DEPLOY.md](DEPLOY.md)** (Supabase → GitHub → Vercel).

---

## 🚀 Rodar localmente

Pré-requisito: **Node.js 18+** ([nodejs.org](https://nodejs.org)).

```bash
npm install      # instala as dependências
npm run dev      # servidor de desenvolvimento (http://localhost:5173)
```

Outros scripts:

```bash
npm run build    # gera a versão de produção em /dist
npm run preview  # serve a /dist localmente (ideal para testar o PWA)
```

> 💡 A instalação do PWA (botão "Instalar") aparece na versão de produção.
> Para testar, rode `npm run build && npm run preview` e abra o endereço mostrado.

---

## 💾 Como os dados são salvos

O app foi escrito originalmente para o ambiente Claude, que oferecia uma API
`window.storage`. Aqui ela foi **substituída por um polyfill** que mantém a
mesma assinatura assíncrona:

```js
await window.storage.get(key, shared)      // -> { value } | null
await window.storage.set(key, value, shared)
await window.storage.delete(key, shared)
await window.storage.list(shared)          // -> { keys: [...] }
```

- **Sem configuração** → usa o **localStorage** do navegador (dados ficam só
  neste dispositivo). Funciona offline e não precisa de back-end.
- **Com Supabase configurado** → os dados marcados como `shared: true`
  (a agenda compartilhada da equipe) passam a ser salvos no Supabase e
  sincronizam entre todos. O localStorage continua como cache offline.

A sessão de login (`shared: false`) é sempre local por dispositivo.

O polyfill base fica inline em [`index.html`](index.html) e a troca para o
Supabase em [`src/storage.js`](src/storage.js).

---

## ☁️ Configurar o Supabase (opcional)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode:

   ```sql
   create table if not exists agenda_store (
     key        text primary key,
     value      text,
     shared     boolean default true,
     updated_at timestamptz default now()
   );

   alter table agenda_store enable row level security;

   -- Ferramenta interna de equipe: acesso liberado com a chave anon.
   -- Para algo mais restrito, troque por policies com auth do Supabase.
   create policy "equipe_floow_all"
     on agenda_store for all
     using (true) with check (true);
   ```

3. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.
4. Crie um arquivo `.env` na raiz (use o `.env.example` como base):

   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   VITE_SUPABASE_TABLE=agenda_store
   ```

5. Reinicie o `npm run dev`. No console do navegador deve aparecer
   `[storage] Supabase conectado`.

> ⚠️ A `anon key` fica exposta no front-end (é normal). A segurança real vem
> das **RLS policies**. A policy acima libera tudo — adequado para uma
> ferramenta interna; ajuste conforme a sua necessidade.

---

## 📦 Publicar na Vercel

1. Suba o código para o **GitHub** (veja abaixo).
2. Em [vercel.com](https://vercel.com) → **Add New Project** → importe o repositório.
3. A Vercel detecta o Vite automaticamente:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Se usar Supabase, adicione as variáveis em **Settings → Environment Variables**:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_TABLE`.
5. **Deploy**. Pronto. 🎉

### Alternativa: Netlify

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- Variáveis de ambiente: as mesmas `VITE_SUPABASE_*`.

---

## 🐙 Enviar para o GitHub

```bash
git init
git add .
git commit -m "Agenda FLOOW — app Vite + PWA"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/agenda-floow.git
git push -u origin main
```

O `.gitignore` já ignora `node_modules`, `dist` e o `.env` (suas credenciais
**não** vão para o repositório).

---

## 📱 Instalar como app (PWA)

- **Desktop (Chrome/Edge):** ícone de instalar na barra de endereço.
- **Android (Chrome):** menu → "Adicionar à tela inicial" / "Instalar app".
- **iOS (Safari):** compartilhar → "Adicionar à Tela de Início".

Funciona offline com os dados em cache (localStorage + cache do app shell).

---

## 🗂️ Estrutura

```
agenda-floow/
├── index.html          # interface + estilos + lógica da agenda (+ polyfill inline)
├── src/
│   ├── main.js          # inicializa o backend de storage e o PWA
│   └── storage.js       # troca o backend para o Supabase (se configurado)
├── public/
│   └── icon.svg         # ícone do PWA
├── vite.config.js       # config do Vite + vite-plugin-pwa
├── .env.example         # modelo das variáveis do Supabase
└── package.json
```
