# Contexto do Projeto: GRAL (Gestão de Formaturas)

Este documento serve como guia e contexto persistente para todos os agentes de IA e desenvolvedores envolvidos no projeto. Todo seu escopo baseia-se estritamente na documentação oficial da Equipe GRAL e nas diretrizes do professor. **NÃO ignore estas diretrizes.**

## 1. Módulos e Perfis de Acesso
O sistema atende a três perfis: **Formandos**, **Pais/Responsáveis Financeiros** e **Equipe Interna**. O escopo é segmentado em cinco módulos:
1. Módulo de Acesso e Perfil (Login/Recuperação)
2. Módulo de Gestão de Documentos (Envio e Aprovação)
3. Módulo de Mídias (Fotos e Vídeos)
4. Módulo Financeiro (Histórico, Pagamentos e Extratos)
5. Módulo de Comunicação e Administração (Calendário e Notificações)

## 2. Stack Tecnológica Base
- **Frontend (View)**: React Native + Expo (TypeScript). Navegação com `@react-navigation`. Consumo da API via nativo ou bibliotecas (Fetch/Axios).
- **Backend (API RESTful)**: **Node.js com NestJS**.
- **Banco de Dados**: PostgreSQL.
- **Armazenamento de Arquivos/Mídias**: AWS S3.

## 3. Arquitetura e Organização Backend (Adaptado para NestJS)
Evoluindo a concepção clássica do MVC, o backend no NestJS separa rigorosamente as responsabilidades para manter o código escalável e seguro:

- **Controllers**: Responsáveis EXCLUSIVAMENTE por receber requisições HTTP, delegar processamento e retornar respostas estruturadas. Não possuem lógica de negócio.
- **DTOs (Data Transfer Objects)**: Todas as entradas da API devem ser validadas rigorosamente utilizando DTOs e a biblioteca `class-validator`, garantindo a integridade e segurança dos dados recebidos.
- **Services**: Concentram **todas as regras de negócio** da aplicação, cálculos financeiros e transições lógicas.
- **Camada de Persistência (Prisma)**: Responsável pelo mapeamento, acesso e manipulação das tabelas e relacionamentos no banco PostgreSQL utilizando o Prisma ORM.
- **Middlewares / Guards / Filters**: Interceptadores responsáveis por autenticação, autorização isolada, tratamento global e padronizado de erros e logs.

### Estrutura de Diretórios Sugerida (Backend)
```text
src/
 ├── modules/         # Módulos organizados por domínio (auth, financeiro, midias, etc)
 │    ├── dto/        # Objetos de validação de entrada (class-validator)
 │    ├── [modulo].controller.ts
 │    ├── [modulo].service.ts
 │    └── [modulo].module.ts
 ├── prisma/          # Schema do ORM e migrações
 ├── common/          # Guards de Auth, Middlewares e Filters globais
 ├── config/          # Variáveis de ambiente configuradas
 └── main.ts          # Bootstrap
```

## 4. Padrões de Projeto Oficiais
- **Singleton**: Conexão única gerida pelo NestJS para instâncias de Banco de Dados (PrismaClient) e Storage (AWS S3 SDK), otimizando o consumo de memória.
- **Observer**: Sistema de notificação desacoplado. A criação de um evento ou aviso "dispara" uma notificação, implementado de forma **simples** (ex: Event Emitter padrão do NestJS).
- **Strategy**: Isolamento da lógica de métodos de pagamento (Pix vs. Cartão de Crédito) para garantir um Módulo Financeiro limpo, sem longas sequências de validação `if/else`.

## 5. Diretrizes de API e Segurança
Conforme exigências teóricas de construção de API REST:
- **Swagger / OpenAPI**: A documentação automática e visualização dos endpoints da API deve ser mantida obrigatoriamente utilizando Swagger acoplado ao NestJS.
- **API Versioning**: A API deve ser versionada desde a raiz (ex: `/api/v1/`), garantindo escalabilidade junto ao mobile.
- **Status HTTP**: O backend deve responder com códigos padrões semânticos (200 OK, 400 Bad Request, 401 Unauthorized, 404 Not Found, 405 Method Not Allowed, 409 Conflict).
- **Variáveis de Ambiente (`.env`)**: Chaves de API, secrets JWT e URLs de banco devem ficar EXCLUSIVAMENTE no `.env`, nunca fixados no código.
- **Autenticação Segura (JWT)**: JSON Web Tokens definem o perfil logado. O painel da "Equipe Interna" requer *Guards* restritos e exclusivos (Isolamento de privilégios - RNF03).
- **Proteção Extra**: Proteção rigorosa contra SQL Injection (garantida via Prisma, que elimina strings brutas de SQL), CORS ativado e criptografia de senhas usando hashing forte (ex: Bcrypt).

## 6. Regras de Negócio Críticas (Docs) e Desempenho
- **Responsabilidade do Backend**: O Frontend não valida regras profundas. Exemplo: A mudança de "Documento Pendente" para "Aprovado" acontece via serviço autorizado da Equipe Interna no Backend (RN01), assim como a autorização de visibilidade, já que o Formando visualiza apenas sua turma (RN02).
- **Performance de Download (RNF04)**: As requisições de mídia devem ocorrer por paginação ou uso inteligente de URLs pré-assinadas da AWS para garantir carregamento sub 3 segundos.
- **Acessibilidade**: Frontends devem manter suporte a Textos Alternativos (alt text) e leitores nativos (RNF01 e RNF02).

## 7. Convenções Git, CI/CD e Testes
- **Branching e Commits**: Fluxo entre `main` (produção) e `develop`. Adotar nomes de branch por features (`feat/`, `fix/`) e marcação padronizada de commits (Conventional Commits).
- **Testes**: Foco em Testes Unitários nas camadas de `Services` (Regras de negócio isoladas) e Testes E2E via Supertest/Jest em endpoints na API. No front-end, focar em renderização de fluxos.

## 8. Escalabilidade para Painel Administrativo Futuro

Embora o foco atual do projeto seja o aplicativo mobile do formando (frontend-app), toda a arquitetura do backend deve ser pensada de forma desacoplada e reutilizável para suportar futuramente um painel administrativo web separado (admin-web).

O backend deve funcionar como núcleo central da aplicação, atendendo múltiplos clientes (mobile e web) através da mesma API REST.

As regras de negócio, permissões, autenticação e validações NÃO devem depender exclusivamente do frontend mobile atual.

Rotas administrativas, permissões da Equipe Interna, upload de mídias, gerenciamento de eventos, documentos e notificações devem permanecer centralizados no backend e preparados para consumo futuro por um painel web administrativo.

Evite qualquer lógica acoplada especificamente ao aplicativo mobile. Priorize APIs reutilizáveis, modulares e escaláveis.

## 9. Validação de etapas backend (DIRETRIZ PERMANENTE)
OBJETIVO:
O frontend React Native do projeto GRAL já possui telas, componentes visuais, navegação e diversos dados simulados (mockados) utilizados apenas para validação visual da interface. Esses dados temporários NÃO representam a implementação final do sistema.

REGRA PRINCIPAL:
Durante a implementação do backend, NÃO substituir automaticamente dados mockados do frontend por chamadas reais da API. A integração Frontend ↔ Backend deve ocorrer somente quando o usuário der "ok".

FLUXO OBRIGATÓRIO PARA CADA MÓDULO:
1. Implementar o backend do módulo solicitado.
2. Validar arquitetura, regras de negócio e banco de dados.
3. Criar DTOs, Services, Controllers e validações necessárias.
4. Expor endpoints documentados via Swagger.
5. Permitir testes completos via Swagger antes de qualquer integração com o frontend.
6. Aguardar aprovação do usuário.
7. Somente após solicitação explícita realizar a integração do frontend com a API.

REGRAS DE SEGURANÇA:
- Nunca remover componentes visuais existentes do frontend.
- Nunca alterar layout, estilos, navegação ou experiência visual sem solicitação explícita.
- Nunca substituir dados mockados automaticamente.
- Nunca presumir que uma tela deve ser conectada apenas porque existe um endpoint correspondente.

PRESERVAÇÃO DOS MOCKS:
Os dados simulados existentes devem permanecer funcionando até que a integração real seja solicitada. (Ex: Valores financeiros fictícios, parcelas de exemplo, galerias com imagens placeholder, notificações simuladas, eventos de exemplo, documentos fictícios).

SWAGGER:
Todo endpoint implementado deve ser documentado adequadamente no Swagger. O Swagger será utilizado como ferramenta principal de validação funcional antes da integração com o frontend.

PROCESSO DE ENTREGA:
1. Implementar backend.
2. Testar via Swagger.
3. Apresentar o que foi criado.
4. Aguardar aprovação.
5. Somente depois integrar ao frontend caso solicitado.
Nenhuma integração automática deve ser realizada sem autorização explícita do usuário.

## 10. Regra de Ouro
**NUNCA modifique grandes partes do projeto ou a estrutura principal sem explicar a decisão e obter aprovação prévia.** Mantenha a API limpa, com DTOs validados e segurança em primeiro lugar.
