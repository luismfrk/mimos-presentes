-- Execute no SQL Editor com usuários de teste. As instruções completas estão no README.
-- Visitante: deve ver somente produtos publicados e não pode inserir.
set local role anon; select * from public.products; rollback;
-- A autorização administrativa nunca é criada pelo próprio cliente: não há policy INSERT em admin_users.
