# EventHub - Sistema de Gestao de Eventos e Inscricoes

Aplicacao web monolitica (arquitetura MVC) para cadastro de eventos e controle de inscritos.

## Tecnologias

- Node.js + Express
- EJS (renderizacao no servidor)
- MySQL (mysql2)
- express-session (cookies httpOnly)
- bcryptjs (hash de senhas)
- helmet, express-validator, dotenv

## Arquitetura MVC

```
eventhub-mvc/
├── app.js / server.js
├── config/database.js
├── routes/
├── controllers/
├── models/
├── middlewares/
├── views/
└── public/
```

## Instalacao

```
npm install
```

## Configuracao do .env

Copie `.env.example` para `.env` e preencha com os dados do seu MySQL:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=eventhub
SESSION_SECRET=uma_chave_aleatoria
NODE_ENV=development
```

## Banco de dados

Rode o script `eventhub.sql` no MySQL para criar o banco e as tabelas.

## Executar

```
npm run dev
```

Acesse: http://localhost:3000

## Deploy (Render)

1. Suba o projeto no GitHub.
2. Crie um Web Service no Render apontando para o repositorio.
3. Configure as variaveis de ambiente (as mesmas do `.env`) no painel do Render.
4. Build command: `npm install` — Start command: `node server.js`.

Link da aplicacao em producao: _preencher apos o deploy_

## Funcionalidades

- Cadastro/login de organizadores e participantes
- CRUD de eventos (organizador)
- Listagem, busca e detalhes de eventos
- Inscricao de participantes com validacao de vagas e duplicidade
- Visualizacao de inscritos (organizador) e minhas inscricoes (participante)

## Seguranca

- Senhas com hash bcrypt
- Sessao com cookie httpOnly
- Prepared statements (mysql2) em todas as queries
- Validacao e sanitizacao de entrada (express-validator)
- Helmet
- Tratamento de erros sem stack trace em producao