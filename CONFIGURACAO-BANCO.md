# 🗄️ Configuração do PostgreSQL

## ✅ Configuração Concluída

O projeto foi configurado para usar PostgreSQL com as seguintes configurações:
- **Usuário**: matheus
- **Senha**: admin123
- **Banco de dados**: meu_banco
- **Host**: localhost
- **Porta**: 5432

## 📋 Próximos Passos

### 1. Criar arquivo de configuração
Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL=postgresql://matheus:admin123@localhost:5432/meu_banco

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-12345
```

### 2. Testar conexão
Execute o comando para testar a conexão:
```bash
npm run test-db
```

### 3. Inicializar banco de dados
Execute o comando para criar as tabelas:
```bash
npm run init-db
```

### 4. Iniciar aplicação
Execute o comando para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

## 🔧 Scripts Disponíveis

- `npm run check-postgres` - Verifica se o PostgreSQL está rodando
- `npm run test-db` - Testa a conexão com o banco de dados (método padrão)
- `npm run test-db-alt` - Testa a conexão com configurações alternativas
- `npm run init-db` - Cria as tabelas necessárias no banco
- `npm run dev` - Inicia o servidor de desenvolvimento

## 🚨 Solução de Problemas

### Erro: "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"

Este erro geralmente indica problemas de autenticação. Siga estes passos:

1. **Verifique se o PostgreSQL está rodando:**
   ```bash
   npm run check-postgres
   ```

2. **Teste com configurações alternativas:**
   ```bash
   npm run test-db-alt
   ```

3. **Se ainda houver erro, verifique no PostgreSQL:**
   - O usuário "matheus" existe
   - A senha está correta
   - O banco "meu_banco" existe
   - O usuário tem permissões no banco

4. **Comandos SQL para verificar/criar:**
   ```sql
   -- Conectar como superusuário (postgres)
   CREATE USER matheus WITH PASSWORD 'admin123';
   CREATE DATABASE meu_banco OWNER matheus;
   GRANT ALL PRIVILEGES ON DATABASE meu_banco TO matheus;
   ```

## 📊 Estrutura do Banco

O banco será criado com as seguintes tabelas:

### users
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- password (VARCHAR)
- name (VARCHAR)
- created_at (TIMESTAMP)

### raffles
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER REFERENCES users)
- name (VARCHAR)
- items (TEXT[])
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## ⚠️ Importante

- Certifique-se de que o PostgreSQL está rodando
- O usuário "matheus" deve ter permissões no banco "meu_banco"
- O arquivo `.env` não deve ser commitado no Git (já está no .gitignore)
