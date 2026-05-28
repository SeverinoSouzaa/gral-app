# GRAL Backend Application

Este é o backend do sistema GRAL (Gestão de Formaturas), desenvolvido com **Node.js** e **NestJS**. A arquitetura foi desenhada rigorosamente para seguir as diretrizes do documento de requisitos oficiais, implementando o padrão MVC adaptado para o NestJS.

## Stack Tecnológica
- **Framework Core**: Node.js + NestJS
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Segurança**: JWT (JSON Web Tokens) e Bcrypt para senhas
- **Armazenamento de Mídias**: AWS S3
- **Documentação de API**: Swagger (OpenAPI)

## Estrutura e Arquitetura

O backend foi separado de acordo com os módulos propostos e padrões arquiteturais documentados.

```
src/
├── modules/
│   ├── auth/          # Módulo de Acesso (Login, Recuperação)
│   ├── users/         # Módulo de Gestão de Usuários e Perfis
│   ├── turmas/        # Módulo de Gestão de Turmas
│   ├── financeiro/    # Módulo Financeiro (Strategy Padrão)
│   ├── documentos/    # Módulo de Gestão de Documentos
│   ├── midias/        # Módulo de Mídias
│   ├── notificacoes/  # Módulo de Notificações (Observer Padrão)
│   ├── calendario/    # Módulo de Calendário Oficial
│   └── eventos/       # Módulo de Eventos
├── common/            # Camada comum (Guards, Middlewares, Filters, Interceptors)
├── config/            # Configurações globais e variáveis de ambiente
├── prisma/            # Serviço Singleton de acesso ao banco Prisma
└── main.ts            # Entrypoint configurado (CORS, ValidationPipe global e Swagger)
```

## Padrões de Projeto Utilizados
- **Singleton**: Conexão única garantida para Banco de Dados (`PrismaService`) e Storage (`S3Service`).
- **Observer**: Usado no Módulo de Comunicação para disparar notificações desacopladas (`@nestjs/event-emitter`).
- **Strategy**: Usado no Módulo Financeiro para isolar a lógica de cobrança e pagamento.

## Próximos Passos
1. Execute `npm run start:dev` para iniciar a aplicação localmente.
2. Inicie a configuração do banco de dados alterando o arquivo `.env` com base no `.env.example`.
3. Rode `npx prisma migrate dev` para as migrações (assim que o schema for definido).

## Versionamento
A API é versionada por padrão e responderá na raiz `/api/v1/`.
