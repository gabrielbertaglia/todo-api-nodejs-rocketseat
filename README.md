# API Gerenciador de Tarefas

## 🚀 Como rodar o projeto localmente

### Pré-requisitos

-   Node.js
-   PostgreSQL
-   npm

### 1. Clonar o repositório

``` bash
git clone https://github.com/gabrielbertaglia/todo-api-nodejs-rocketseat.git
cd todo-api-nodejs-rocketseat
```

### 2. Instalar dependências

``` bash
npm install
```

### 3. Configurar variáveis de ambiente

Criar um arquivo `.env` na raiz do projeto:

``` env
DATABASE_URL=postgresql://user:password@localhost:5432/database
JWT_SECRET=sua_chave_secreta
PORT=3333
```

### 4. Rodar migrations

``` bash
npx prisma migrate dev
```

### 5. Rodar a aplicação

``` bash
npm run dev
```

A aplicação rodará em:

    http://localhost:3333

------------------------------------------------------------------------

# 📌 Documentação dos Endpoints

Base URL:

    http://localhost:3333

------------------------------------------------------------------------

## 🔐 Sessions

### Criar Sessão

**POST** `/sessions`

Body:

``` json
{
  "email": "gabriel@email.com",
  "password": "123456"
}
```

------------------------------------------------------------------------

## 👤 Users

### Criar Usuário

**POST** `/users`

Body:

``` json
{
  "name": "Gabriel",
  "email": "gabriel@email.com",
  "password": "123456"
}
```

------------------------------------------------------------------------

## 👥 Teams

### Criar Time

**POST** `/teams`

### Listar Times

**GET** `/teams`

### Atualizar Time

**PUT** `/teams/:id`

### Deletar Time

**DELETE** `/teams/:id`

### Listar Membros do Time

**GET** `/teams/:teamId/members`

------------------------------------------------------------------------

## 🤝 Team Members

### Adicionar Usuários ao Time

**POST** `/team-members`

Body:

``` json
{
  "teamId": "uuid",
  "userIds": ["uuid1", "uuid2"]
}
```

### Remover Usuário do Time

**DELETE** `/team-members/teams/:teamId/members/:userId`

------------------------------------------------------------------------

## 📋 Tasks

### Criar Tarefa

**POST** `/tasks`

### Atualizar Tarefa

**PUT** `/tasks/:id`

### Deletar Tarefa

**DELETE** `/tasks/:id`

### Listar Tarefas por Time

**GET** `/tasks/:teamId`

Query Params opcionais: - `status` - `priority`

------------------------------------------------------------------------

## 📜 Task History

### Listar Histórico da Tarefa

**GET** `/task-history/:taskId`

------------------------------------------------------------------------

# 🧪 Rodando os Testes

### Rodar todos os testes

``` bash
npm run test:dev
```

Tecnologias utilizadas:

-   Jest
-   Supertest

------------------------------------------------------------------------

# 🌍 Deploy

Adicionar aqui o link de produção:

    https://todo-api-nodejs-api.onrender.com
