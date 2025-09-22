# 🔍 Diagnóstico dos Erros no Netlify

## 🚨 Problemas Identificados

### 1. **Erro 401 - `/api/auth/me`**
- **Causa**: Token de autenticação não encontrado ou inválido
- **Solução**: Verificar se o JWT_SECRET está configurado corretamente

### 2. **Erro 400 - `/api/auth/register`**
- **Causa**: Falha na criação do usuário
- **Possíveis motivos**:
  - Pool de conexão não configurado
  - Tabelas não existem no banco
  - Email já existe
  - Problema na conexão com o banco

## 🔧 Soluções

### **Passo 1: Verificar Variáveis de Ambiente**

1. Acesse seu projeto no Netlify
2. Vá em **Site settings** → **Environment variables**
3. Verifique se TODAS estas variáveis estão configuradas:

```
DATABASE_URL=postgresql://postgres.qrzzttxxerugiwkqwhvg:Matheus10032006%40@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
JWT_SECRET=oWuGTMV/hjtOAtvHrFLagygX4xL1UMXIeQ+0am5lqOOmdYFT7u1/derhPO4KPnIV4T0a1vDX2U7aTlT4+0d0Kg==
NEXTAUTH_URL=https://seu-site.netlify.app
NEXTAUTH_SECRET=super-secret-nextauth-key-2024-matheus-app-very-long-and-secure-67890
NODE_ENV=production
SUPABASE_URL=https://qrzzttxxerugiwkqwhvg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyenp0dHh4ZXJ1Z2l3a3F3aHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDkyOTMsImV4cCI6MjA3MzUyNTI5M30.JvkwFcmG4vI9aQdmvtZgpDwSQiKFP4aYqQWJBIlEzsw
```

### **Passo 2: Testar as APIs**

Após configurar as variáveis, teste estas URLs:

1. **Teste de Variáveis**: `https://seu-site.netlify.app/api/test-env`
2. **Teste de Banco**: `https://seu-site.netlify.app/api/test-db`

### **Passo 3: Verificar Tabelas no Supabase**

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor**
3. Verifique se as tabelas `users` e `raffles` existem
4. Se não existirem, execute este SQL:

```sql
-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de sorteios
CREATE TABLE IF NOT EXISTS raffles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  items TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Passo 4: Verificar Logs do Netlify**

1. No Netlify, vá em **Functions** → **Logs**
2. Procure por erros relacionados ao banco de dados
3. Verifique se as variáveis estão sendo carregadas

## 🎯 **Possíveis Causas do Erro**

### **Causa 1: Variáveis não configuradas**
- **Sintoma**: Pool de conexão é null
- **Solução**: Configurar todas as variáveis de ambiente

### **Causa 2: Tabelas não existem**
- **Sintoma**: Erro "relation does not exist"
- **Solução**: Criar as tabelas no Supabase

### **Causa 3: Email já existe**
- **Sintoma**: Erro de constraint unique
- **Solução**: Usar um email diferente ou verificar se o usuário já existe

### **Causa 4: Problema de SSL**
- **Sintoma**: Erro de conexão SSL
- **Solução**: Verificar se `ssl: { rejectUnauthorized: false }` está configurado

## 🚀 **Próximos Passos**

1. ✅ Configurar todas as variáveis de ambiente
2. ✅ Fazer novo deploy
3. ✅ Testar as APIs de diagnóstico
4. ✅ Verificar se as tabelas existem
5. ✅ Testar criação de usuário

## 📞 **Se ainda não funcionar**

1. Verifique os logs do Netlify
2. Teste as APIs de diagnóstico
3. Verifique se o email já existe no banco
4. Confirme se a URL do site está correta no NEXTAUTH_URL
