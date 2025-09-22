# 🔗 Guia: Como Obter a Connection String do Supabase

## 📋 Passo a Passo Detalhado

### 1️⃣ **Acessar o Supabase Dashboard**
- Vá para: https://supabase.com/dashboard
- Faça login com sua conta
- Selecione seu projeto: `qrzzttxxerugiwkqwhvg`

### 2️⃣ **Navegar para Database Settings**
- No menu lateral esquerdo, clique em **"Settings"**
- Clique em **"Database"**

### 3️⃣ **Encontrar Connection String**
Na página de Database, procure por uma seção chamada:
- **"Connection string"**
- **"Connection pooling"** 
- **"Database URL"**
- **"PostgreSQL connection string"**

### 4️⃣ **Escolher o Tipo Correto**

#### 🎯 **Para Netlify (RECOMENDADO):**
Use a **Connection Pooling**:
```
postgresql://postgres.qrzzttxxerugiwkqwhvg:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

#### 🔧 **Outras Opções Disponíveis:**

**Direct Connection:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.qrzzttxxerugiwkqwhvg.supabase.co:5432/postgres
```

**Session Mode:**
```
postgresql://postgres.qrzzttxxerugiwkqwhvg:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### 5️⃣ **Copiar e Personalizar**
1. Clique no botão **"Copy"** ao lado da connection string
2. Substitua `[YOUR-PASSWORD]` por: `Matheus10032006@`

### 6️⃣ **Resultado Final**
Sua connection string final deve ser:
```
postgresql://postgres.qrzzttxxerugiwkqwhvg:Matheus10032006%40@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## ⚠️ **Importante:**
- Use sempre a **Connection Pooling** para aplicações serverless (como Netlify)
- A porta **6543** é para pooling, **5432** é para conexão direta
- Mantenha sua senha segura e nunca a compartilhe

## 🔍 **Se Não Encontrar a Connection String:**
1. Verifique se você está na seção correta (Settings > Database)
2. Procure por abas ou seções expandíveis
3. Alguns projetos podem ter a connection string em "API" ou "General"
4. Se ainda não encontrar, tente procurar por "PostgreSQL" ou "Database URL"

## 📱 **Próximos Passos:**
1. Copie a connection string correta
2. Configure no Netlify (Site settings > Environment variables)
3. Adicione como: `DATABASE_URL=sua-connection-string-aqui`
4. Faça um novo deploy
5. Teste a funcionalidade
