
# Melhorias UX do Painel Admin + Deletar Usuarios

## Resumo

Adicionar funcionalidade de deletar usuario completo (dados + conta auth), melhorar a UX com refresh imediato apos acoes, e criar uma edge function dedicada para exclusao administrativa.

## 1. Nova Edge Function: `admin-delete-user`

**Arquivo:** `supabase/functions/admin-delete-user/index.ts`

Edge function que recebe um `target_user_id` no body, verifica que o chamador e admin (via `has_role`), e deleta todos os dados do usuario alvo:

- Verifica token JWT do chamador
- Consulta `has_role(caller_id, 'admin')` usando service role client
- Deleta dados de todas as tabelas (mesma ordem da funcao `delete-user-data` existente)
- Deleta arquivos de storage (avatars, try-on-results, etc.)
- Deleta usuario do auth via `admin.deleteUser()`
- Retorna resultado detalhado

## 2. Atualizar `useAdmin` Hook

**Arquivo:** `src/hooks/useAdmin.ts`

Adicionar funcao `deleteUser(userId)`:

- Chama a edge function `admin-delete-user` com o token do admin
- Exibe toast de sucesso/erro
- Invalida queries `admin-users` e `admin-stats` imediatamente
- Adicionar na interface `AdminHookResult`

Tambem garantir que **todas as funcoes existentes** (ban, unban, changeUserPlan, promote, demote) invalidem as queries `admin-stats` alem de `admin-users`, para que os contadores do dashboard atualizem tambem.

## 3. Atualizar `UserManagement.tsx`

**Arquivo:** `src/components/admin/UserManagement.tsx`

Mudancas:

- Adicionar opcao "Excluir Permanentemente" no dropdown de acoes (com icone Trash2, cor destructive)
- Adicionar entrada `delete` no `confirmLabels` com mensagem forte de alerta: "Esta acao e IRREVERSIVEL. Todos os dados serao excluidos permanentemente."
- No `executeConfirmAction`, tratar tipo `delete` chamando `deleteUser(userId)`
- Fechar o sheet de detalhes apos exclusao

## 4. Atualizar `UserDetailSheet.tsx`

**Arquivo:** `src/components/admin/UserDetailSheet.tsx`

Mudancas:

- Adicionar botao "Excluir Conta Permanentemente" abaixo do botao de ban
- AlertDialog com confirmacao dupla (mensagem clara de irreversibilidade)
- Fechar o sheet e invalidar queries apos exclusao
- Receber callback `onUserDeleted` para fechar o sheet e atualizar a lista

## 5. Refresh Imediato

Garantir que todas as acoes (ban, unban, promote, demote, delete, change plan) facam `await refetch()` logo apos a acao, e que os stats do dashboard (`admin-stats`) tambem sejam invalidados. Remover o `setTimeout(() => refetch(), 300)` atual no `onOpenChange` do sheet e substituir por invalidacao direta nas funcoes do hook.

## Detalhes Tecnicos

### Edge Function `admin-delete-user`

```text
POST /admin-delete-user
Body: { "target_user_id": "uuid" }
Auth: Bearer token (admin only)

1. Verificar JWT do chamador
2. Verificar has_role(caller, 'admin') via service role
3. Impedir que admin delete a si mesmo
4. Deletar de: notifications, notification_preferences, try_on_results, 
   user_avatars, recommended_looks, outfits, trips, user_events, 
   wardrobe_items, external_garments, app_feature_flags (se houver), 
   user_roles, profiles
5. Deletar storage files
6. Deletar auth user
7. Retornar resultado
```

### Resumo de arquivos

| Arquivo | Acao |
|---|---|
| `supabase/functions/admin-delete-user/index.ts` | Novo -- edge function para exclusao administrativa |
| `src/hooks/useAdmin.ts` | Adicionar `deleteUser`, melhorar invalidacao de cache |
| `src/components/admin/UserManagement.tsx` | Opcao de excluir no dropdown, confirmacao, refresh imediato |
| `src/components/admin/UserDetailSheet.tsx` | Botao de excluir, callback de atualizacao, receber `onUserDeleted` |
