# 🚀 Publicar a Agenda FLOOW na nuvem (equipe inteira)

Guia passo a passo, sem precisar instalar nada no seu computador.

Resultado final: um **link** (ex.: `https://agenda-floow.vercel.app`) que toda a
equipe abre, faz login, e **todos veem e editam a mesma agenda** (graças ao Supabase).

Ordem recomendada:
1. **Supabase** (banco de dados compartilhado) → ~5 min
2. **GitHub** (guardar o código) → ~5 min
3. **Vercel** (publicar o site) → ~5 min

---

## 1️⃣ Supabase — banco de dados da equipe

1. Acesse [supabase.com](https://supabase.com) → **Start your project** → entre com o GitHub ou e-mail.
2. **New project**:
   - **Name:** `agenda-floow`
   - **Database Password:** crie uma senha forte e **guarde** (você não precisará dela no app, mas o Supabase pede).
   - **Region:** escolha **South America (São Paulo)** se disponível.
   - Clique **Create new project** e aguarde ~2 min.
3. No menu lateral, abra **SQL Editor** → **New query**.
4. Abra o arquivo [`supabase/schema.sql`](supabase/schema.sql) deste projeto, **copie todo o conteúdo**, cole no editor e clique **Run** (canto inferior direito). Deve aparecer "Success".
5. No menu lateral, abra **Project Settings** (engrenagem) → **API**. Anote:
   - **Project URL** → algo como `https://abcdxyz.supabase.co`
   - **Project API keys → `anon` `public`** → uma chave longa começando com `eyJ...`

   👉 Guarde esses dois valores; você vai colá-los na Vercel no passo 3.

> A `anon key` pode ficar visível no front-end — é normal. A proteção real vem
> das policies (RLS) que o `schema.sql` já criou.

---

## 2️⃣ GitHub — guardar o código

Você **não tem git instalado**, então vamos pelo site (jeito mais fácil):

1. Acesse [github.com](https://github.com) → faça login / crie conta.
2. Canto superior direito **+** → **New repository**.
   - **Repository name:** `agenda-floow`
   - Deixe **Private** (recomendado para uma ferramenta interna).
   - **NÃO** marque "Add a README".
   - **Create repository**.
3. Na página seguinte, clique no link **"uploading an existing file"**
   (ou aba **Add file → Upload files**).
4. Abra a pasta `agenda-floow` no seu computador e **arraste para a página**
   TODOS os itens abaixo (pode arrastar a pasta inteira de uma vez):
   ```
   index.html
   package.json
   vite.config.js
   README.md
   DEPLOY.md
   .gitignore
   .env.example
   src/        (pasta)
   public/     (pasta)
   supabase/   (pasta)
   ```
   ⚠️ **NÃO** envie a pasta `node_modules` nem um arquivo `.env` (eles nem existem ainda; se existirem, ignore-os).
5. Escreva uma mensagem (ex.: "primeira versão") e clique **Commit changes**.

> 💡 Mais cômodo no futuro: instale o **GitHub Desktop** (interface gráfica, sem comandos)
> para enviar atualizações com um clique.

---

## 3️⃣ Vercel — publicar o site

1. Acesse [vercel.com](https://vercel.com) → **Sign up** / login **com o GitHub**
   (assim ela já enxerga seus repositórios).
2. **Add New… → Project**.
3. Encontre `agenda-floow` na lista → **Import**.
4. A Vercel detecta o **Vite** automaticamente. Confirme:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Abra **Environment Variables** e adicione as 3 variáveis (cole os valores do passo 1):

   | Name                     | Value                                  |
   |--------------------------|----------------------------------------|
   | `VITE_SUPABASE_URL`      | `https://abcdxyz.supabase.co`          |
   | `VITE_SUPABASE_ANON_KEY` | `eyJ...` (a chave anon public)         |
   | `VITE_SUPABASE_TABLE`    | `agenda_store`                         |

6. Clique **Deploy** e aguarde ~1 min. No fim, você recebe o link público. 🎉

### Conferir se o Supabase conectou
Abra o link, aperte **F12** (Console do navegador). Deve aparecer:
`[storage] Supabase conectado — dados da equipe sincronizados na nuvem.`

---

## 👥 Primeiro acesso da equipe

O app já vem com usuários de exemplo (definidos na aba **Config**):

| Nome    | E-mail                      | Senha      | Papel  |
|---------|-----------------------------|------------|--------|
| Eduardo | eduardo@floowdigital.com    | `admin123` | Admin  |
| Rafe    | rafe@floowdigital.com       | `admin123` | Admin  |
| Yuri    | yuri@floowdigital.com       | `123456`   | Equipe |
| Luan    | luan@floowdigital.com       | `123456`   | Equipe |

**Faça login como admin** (Eduardo) e vá em **⚙️ Config** para:
- Trocar as senhas (⚠️ **importante** — as de exemplo são públicas).
- Ajustar nomes, e-mails e quem é responsável por cada demanda.

A partir daí, qualquer pessoa abre o link, faz login com o e-mail/senha dela e
vê a mesma agenda. Tudo que um admin altera aparece para todos.

---

## 📱 Instalar como aplicativo (PWA)

Com o site no ar (HTTPS da Vercel), dá para "instalar":
- **Celular (Chrome/Safari):** menu → "Adicionar à tela inicial".
- **Computador (Chrome/Edge):** ícone de instalar na barra de endereço.

Abre como um app, com ícone próprio, e funciona mesmo com internet instável.

---

## 🔄 Atualizar o app depois

Sempre que mudar o código:
1. Suba os arquivos alterados no GitHub (Add file → Upload, ou GitHub Desktop).
2. A Vercel **reconstrói e republica sozinha** em ~1 min. Sem passos manuais.

---

## ⚠️ Observações de segurança / limites

- **Senhas no app:** ficam guardadas em texto (controle interno de equipe). Não use
  senhas reutilizadas de outros serviços.
- **Edição simultânea:** os dados são salvos como um único bloco. Se duas pessoas
  editarem ao **mesmo segundo**, a última gravação vence. Para uma equipe pequena
  isso raramente é problema.
- **Repositório privado:** mantenha o GitHub como **Private** para o código não ficar público.
