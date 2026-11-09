# Mimo Presentes

Catálogo digital e painel administrativo da Mimo Presentes — “Pequenos mimos, grandes sorrisos! 💝”. O projeto usa React, TypeScript, Vite e Supabase, com catálogo responsivo, favoritos, sacola e pedidos pelo WhatsApp.

## Funcionalidades

- Página inicial com acesso ao catálogo, WhatsApp e Instagram oficiais.
- Catálogo com pesquisa, categorias, ordenação, destaque, novidades e disponibilidade.
- Detalhes, personalização e pedido pelo WhatsApp.
- Favoritos e sacola persistidos no navegador.
- Login administrativo via Supabase Auth e autorização na tabela protegida `admin_users`.
- Dashboard e gerenciamento de produtos, categorias e imagens.
- PostgreSQL com constraints, índices, RLS e políticas de Storage.

Os ícones da interface utilizam a biblioteca [Flaticon UIcons](https://www.flaticon.com/uicons).

## Execução local

Requer Node.js 20 ou superior.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com valores públicos do projeto. Nunca use uma `service_role` no frontend. Sem essas variáveis, o catálogo abre em modo demonstração e as operações administrativas ficam desabilitadas.

## Supabase

1. Crie um projeto no Supabase.
2. Execute `supabase/migrations/202611090001_initial_schema.sql` no SQL Editor ou use `supabase db push` com a CLI vinculada.
3. Em Authentication, crie manualmente o primeiro usuário administrador. Não habilite cadastro público.
4. No SQL Editor, insira a autorização usando o UUID desse usuário:

```sql
insert into public.admin_users (user_id) values ('UUID_DO_USUARIO');
```

A migration cria as tabelas `admin_users`, `categories`, `products` e `product_images`; o bucket público `product-images`; limite de 5 MB; MIME types JPEG, PNG e WebP; e políticas que restringem toda escrita a administradores verificados no banco. Não existe policy que permita ao usuário se tornar administrador.

O catálogo público só lê categorias ativas, produtos publicados e imagens associadas a produtos publicados. Valide as policies num projeto de homologação com um visitante, usuário autenticado comum e administrador antes da produção.

## Configuração dos canais

Os links oficiais ficam em variáveis para permitir troca sem alteração de código:

```env
VITE_WHATSAPP_NUMBER=554288810920
VITE_INSTAGRAM_URL=https://www.instagram.com/mimoo_presentes/
```

## Estrutura

- `src/components`: layouts, cards e proteção de rotas.
- `src/context`: sessão, autorização, favoritos e carrinho.
- `src/pages`: páginas públicas e administrativas.
- `src/services`: acesso aos dados do catálogo.
- `src/lib`: Supabase, utilitários e dados demonstrativos.
- `supabase/migrations`: schema, RLS e Storage.
- `supabase/tests`: roteiro de validação das policies.

## Qualidade

```bash
npm run lint
npm test
npm run build
```

Os testes locais cobrem utilitários de WhatsApp, total do pedido, favoritos e carrinho. Login, CRUD, upload e RLS precisam ainda ser validados contra o projeto Supabase real, pois dependem de credenciais e usuários de teste.

## GitHub, Render e Vercel

O repositório é `https://github.com/luismfrk/mimos-presentes.git`.

Para publicar no Render, crie um Blueprint usando o `render.yaml` da raiz. O serviço usa `npm ci && npm run build`, publica `dist`, redireciona rotas da SPA para `index.html` e solicita `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` durante a criação. Depois de conectado à branch `main`, novos pushes iniciam deploys automáticos.

Para publicar na Vercel, importe o repositório, use `npm run build`, diretório de saída `dist` e cadastre as quatro variáveis listadas em `.env.example`. O `vercel.json` redireciona rotas da SPA para `index.html`.
