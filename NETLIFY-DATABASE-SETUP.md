# 🗄️ Configuração do Banco de Dados no Netlify

## 🚨 Problema Identificado

O erro "Erro interno do servidor" ao criar conta indica que o banco de dados não está configurado no Netlify.

## ✅ Solução: Configurar Banco de Dados

### 1. Escolher um Provedor de Banco PostgreSQL

**Opção 1: Supabase (Recomendado - Gratuito)**
1. Acesse: https://supabase.com
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Vá em Settings > Database
5. Copie a "Connection string"

**Opção 2: Railway**
1. Acesse: https://railway.app
2. Crie uma conta
3. Deploy PostgreSQL
4. Copie a connection string

**Opção 3: Neon**
1. Acesse: https://neon.tech
2. Crie uma conta gratuita
3. Crie um banco PostgreSQL
4. Copie a connection string

### 2. Configurar Variáveis de Ambiente no Netlify

1. Acesse seu projeto no Netlify
2. Vá em **Site settings > Environment variables**
3. Adicione as seguintes variáveis:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
JWT_SECRET=sua-chave-secreta-jwt-muito-longa-e-segura
NEXTAUTH_URL=https://seu-site.netlify.app
NEXTAUTH_SECRET=sua-chave-secreta-nextauth-muito-longa-e-segura
```

### 3. Inicializar o Banco de Dados

Após configurar o banco, você precisa criar as tabelas. Execute este SQL no seu banco:

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

### 4. Testar a Configuração

1. Faça um novo deploy no Netlify
2. Tente criar uma conta
3. Verifique os logs do Netlify se ainda houver erro

## 🔍 Verificação de Logs

Para ver os logs detalhados:
1. No Netlify, vá em **Functions > View logs**
2. Procure por mensagens de erro relacionadas ao PostgreSQL
3. Verifique se a `DATABASE_URL` está sendo carregada

## ⚠️ Importante

- **Nunca** commite credenciais reais no código
- Use sempre variáveis de ambiente para produção
- Teste localmente antes de fazer deploy
- Mantenha as chaves JWT seguras e únicas
