<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest)

URL Shortener API

Esta é a API para encurtamento de URLs, com funcionalidades de autenticação e controle de acesso. Ela permite a criação de URLs encurtados, listagem, atualização e exclusão de URLs, e redirecionamento para a URL original, enquanto mantém a contagem de cliques.

## Project setup

```bash
$ npm install
```

Configurações do Banco de Dados
Certifique-se de que você tem o PostgreSQL instalado e em execução. Crie um banco de dados com o nome de sua escolha.

Configure as variáveis de ambiente no arquivo .env:
```bash
$ DATABASE_HOST=localhost
$ DATABASE_PORT=5432
$ DATABASE_USER=postgres
$ DATABASE_PASSWORD=senha definida
$ DATABASE_NAME=url_shortener

#Configuração do JWT
$ JWT_SECRET=dae7dd412asdg1g4fccb450d4d27a7b21678daee3b512ee059ff (exemplo)
$ JWT_TOKEN_AUDIENCE=http://localhost:3000
$ JWT_TOKEN_ISSUER=http://localhost:3000
$ JWT_TTL="60m"
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

Endpoints

```bash
POST /users/register
POST /users/login
POST /auth/login
POST /urls
GET /urls/shortUrl
GET /urls/all/user
PATCH /urls/originalurl
DELETE /urls/shortUrl
```

## Resources

```bash
NodeJS: v22.13.0
NestJS: Framework para desenvolvimento das APIs.
TypeScript: Linguagem utilizada no desenvolvimento.
PostgreSQL: Banco de dados relacional utilizado para armazenar os dados.
JWT: Autenticação baseada em tokens.
Swagger: Documentação das APIs
```