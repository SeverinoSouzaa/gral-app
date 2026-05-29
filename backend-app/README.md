# GRAL Backend - Gestão de Formaturas

Este é o repositório do backend do projeto GRAL, construído com [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/) e [PostgreSQL](https://www.postgresql.org/).

A arquitetura foi desenhada para ser modular, escalável e seguir fielmente os padrões MVC e API REST, suportando os diferentes perfis do sistema: Formandos, Pais/Responsáveis e Equipe Interna.

## 🚀 Tecnologias e Padrões
- **NestJS**: Framework Node.js progressivo para construção de aplicações eficientes e escaláveis.
- **Prisma ORM**: Tipagem forte e segurança contra SQL Injection, atuando como camada de persistência.
- **PostgreSQL**: Banco de dados relacional oficial do projeto.
- **Segurança**: Autenticação via JWT, proteção de rotas com Guards e Helmet para proteção de cabeçalhos HTTP.
- **Documentação**: Swagger / OpenAPI integrado.
- **Padrões**: Singleton (Conexões de BD), Observer (Eventos e Notificações) e Strategy (Lógica Financeira).

## 📁 Estrutura de Diretórios

O projeto segue uma arquitetura modular por domínios, isolando as regras de negócio:

```text
src/
 ├── common/          # Recursos globais (Guards, Filters, Interceptors, Decorators)
 ├── config/          # Validação e exportação de variáveis de ambiente
 ├── prisma/          # Módulo global do Prisma ORM (Singleton)
 ├── modules/         # Módulos de domínio de negócio:
 │    ├── auth/       # Autenticação, login e recuperação de acesso
 │    ├── users/      # Gestão de perfis (Formandos, Pais, Equipe)
 │    ├── documents/  # Gestão de contratos e aprovações
 │    ├── media/      # Galeria de fotos e vídeos (AWS S3)
 │    ├── finance/    # Pagamentos, boletos, pix e extrato
 │    ├── events/     # Calendário e eventos da turma
 │    └── notifications/ # Avisos sistêmicos
 ├── app.module.ts    # Módulo raiz
 └── main.ts          # Arquivo de bootstrap (Pipes globais, Swagger, CORS, Helmet)
```

## 🛠️ Configuração e Execução

### 1. Preparação do Ambiente
Copie o arquivo de exemplo das variáveis de ambiente e preencha as chaves necessárias (especialmente o `DATABASE_URL`):
```bash
cp .env.example .env
```

### 2. Instalação das Dependências
```bash
npm install
```

### 3. Banco de Dados (Prisma)
Gere os artefatos do Prisma baseados no `schema.prisma` e rode as migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Executando a Aplicação
```bash
# Desenvolvimento local (watch mode)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

Acesse a documentação da API gerada pelo Swagger:
`http://localhost:3000/api/v1/docs`

## 🛡️ Regras da Arquitetura
1. **Controllers**: Apenas recebem a requisição, passam pelo DTO e delegam para o Service. Sem regras de negócio aqui!
2. **Services**: Toda a lógica de negócio, validações profundas e comunicação com o PrismaService reside aqui.
3. **DTOs (Data Transfer Objects)**: Todas as entradas devem ser validadas usando `class-validator`. Nenhuma requisição entra no backend sem validação prévia.

---
*Documentação gerada para orientar a equipe de desenvolvimento durante o ciclo de vida do projeto GRAL.*
