
# Sistema de Criar Conta: Analise e Correcoes

## Diagnostico

### O que esta correto
- Admin: paulo.nakamura@atitude45.com.br ja tem role 'admin' no banco
- A funcao `setup_first_admin` bloqueia novos admins (ja existe um)
- Fluxo de navegacao: Auth -> Onboarding -> Index funciona
- Trigger `handle_new_user` cria profile automaticamente no signup
- RLS policies estao configuradas corretamente em todas as tabelas

### Problemas encontrados

1. **Novos usuarios recebem plano 'free' em vez de 'muse'**
   - A coluna `subscription_plan_id` na tabela `profiles` tem `DEFAULT 'free'`
   - O trigger `handle_new_user` nao define plano, herdando o default 'free'
   - Resultado: todo novo usuario comeca como 'free'

2. **Trial offer no onboarding oferece 'trendsetter' em vez de 'muse'**
   - A funcao `acceptTrial` em `useOnboarding.ts` define `subscription_plan_id: 'trendsetter'`
   - Se o usuario pula o trial, fica com 'free'
   - Em ambos os casos, deveria ser 'muse'

3. **Step de trial no onboarding e desnecessario**
   - Se todos recebem 'muse' por padrao, a oferta de trial perde o sentido
   - O step 'trial-offer' pode ser removido do fluxo para simplificar

## Plano de implementacao

### 1. Migrar default do banco de dados
Alterar o default da coluna `subscription_plan_id` de 'free' para 'muse', e atualizar o trigger `handle_new_user` para definir explicitamente o plano 'muse' com validade de 1 ano.

```text
ALTER TABLE profiles
  ALTER COLUMN subscription_plan_id SET DEFAULT 'muse';

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, subscription_plan_id, subscription_expires_at)
  VALUES (NEW.id, 'muse', now() + interval '1 year');
  RETURN NEW;
END;
$$;
```

### 2. Remover step de trial do onboarding
No `useOnboarding.ts`:
- Remover 'trial-offer' do array `steps`
- Remover funcoes `acceptTrial` e `skipTrial`

### 3. Atualizar `Onboarding.tsx`
- Remover o case 'trial-offer' do switch
- Remover import do `TrialOfferStep`

### 4. Atualizar perfis existentes com plano 'free'
Executar um UPDATE para migrar perfis que ainda estejam em 'free' para 'muse':

```text
UPDATE profiles
SET subscription_plan_id = 'muse',
    subscription_expires_at = now() + interval '1 year'
WHERE subscription_plan_id = 'free';
```

## Resumo de arquivos

| Arquivo | Mudanca |
|---|---|
| Migracao SQL | Alterar default e trigger |
| `src/hooks/useOnboarding.ts` | Remover trial step e funcoes |
| `src/pages/Onboarding.tsx` | Remover case trial-offer |
| Insert SQL | Atualizar perfis existentes para muse |
