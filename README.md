# 🎲 Sorteio Aleatório

Aplicativo web para realizar sorteios aleatórios com funcionalidade de salvar e gerenciar sorteios.

## ✨ Funcionalidades

- 🎯 **Sorteio Aleatório**: Adicione itens e sorteie um vencedor
- 👤 **Sistema de Login**: Registro e autenticação de usuários
- 💾 **Salvar Sorteios**: Salve seus sorteios para reutilizar depois
- 📚 **Gerenciar Sorteios**: Carregue, edite e delete sorteios salvos
- 🎨 **Interface Moderna**: Design responsivo com Tailwind CSS

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT + Cookies HTTP-only
- **Estilização**: Tailwind CSS
- **Deploy**: Netlify (configurado)

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL
- npm ou yarn

## ⚙️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd sorteio-app
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/sorteio_db
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key
   ```

4. **Configure o banco de dados**
   
   Crie um banco PostgreSQL e execute:
   ```bash
   npm run init-db
   ```

5. **Execute o projeto**
   ```bash
   npm run dev
   ```

   Acesse: http://localhost:3000

## 🗄️ Estrutura do Banco

### Tabela `users`
- `id`: ID único do usuário
- `email`: Email único do usuário
- `password`: Senha criptografada
- `name`: Nome do usuário
- `created_at`: Data de criação

### Tabela `raffles`
- `id`: ID único do sorteio
- `user_id`: ID do usuário proprietário
- `name`: Nome do sorteio
- `items`: Array de itens do sorteio
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

## 🌐 Deploy no Netlify

O projeto está configurado para deploy no Netlify:

1. **Conecte seu repositório** no Netlify
2. **Configure as variáveis de ambiente** no painel do Netlify:
   - `DATABASE_URL`: URL do seu banco PostgreSQL
   - `JWT_SECRET`: Chave secreta para JWT
   - `NEXTAUTH_URL`: URL do seu site
   - `NEXTAUTH_SECRET`: Chave secreta do NextAuth

3. **O deploy será automático** com as configurações do `netlify.toml`

## 📁 Estrutura do Projeto

```
├── app/
│   ├── api/           # API Routes
│   │   ├── auth/      # Autenticação
│   │   └── raffles/   # Sorteios
│   ├── login/         # Página de login
│   ├── globals.css    # Estilos globais
│   ├── layout.tsx     # Layout principal
│   └── page.tsx       # Página principal
├── lib/
│   ├── auth.ts        # Funções de autenticação
│   ├── auth-context.tsx # Context de autenticação
│   ├── database.ts    # Configuração do banco
│   └── raffles.ts     # Funções de sorteios
├── scripts/
│   └── init-db.js     # Script de inicialização do banco
├── netlify.toml       # Configuração do Netlify
└── package.json
```

## 🔧 Scripts Disponíveis

- `npm run dev`: Executa o projeto em modo desenvolvimento
- `npm run build`: Gera build de produção
- `npm run start`: Executa o projeto em produção
- `npm run init-db`: Inicializa o banco de dados

## 🛡️ Segurança

- Senhas criptografadas com bcrypt
- JWT tokens com expiração
- Cookies HTTP-only para autenticação
- Validação de dados no backend
- Proteção contra SQL injection

## 📝 Licença

Este projeto está sob a licença MIT.