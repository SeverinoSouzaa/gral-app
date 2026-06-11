# 🧪 Guia de Testes Rigorosos - Módulo de Mídias (Swagger)

Este documento foi criado para registrar a bateria de testes de estresse, segurança e regras de negócio do Módulo de Mídias antes de conectá-lo ao Frontend. O objetivo é tentar "quebrar" a API.

## 🎯 Pré-requisito (Configuração)
A API exige que a Mídia seja anexada a um Evento existente.
Em vez de criar no banco de dados manualmente, use a nossa API real de Eventos!
1. Faça Login como **Equipe Interna** (`POST /auth/login` -> admin@gral.com) e insira o Token.
2. Vá em `POST /eventos` e crie um evento (ex: `nomeEvento: "Studio Day"`, `turmaId: 1`, `eventType: "EVENT"`, `dataEvento: "2026-10-10T00:00:00Z"`).
3. Anote o ID gerado no retorno da requisição (ex: ID `1`).

---

## 🚫 Bateria 1: Testes de Falhas e Segurança (Tentando quebrar a API)

Esses testes validam se a segurança (Guards) e as validações (DTOs e Interceptors) estão blindando o servidor.

### ❌ Teste 1.1: Sem Autenticação
- **Ação:** Sem colocar o Token no cadeado, tente dar um `GET /midias`.
- **Resultado Esperado:** HTTP 401 Unauthorized. (A API recusa intrometidos).

### ❌ Teste 1.2: Violação de Permissão (Role)
- **Ação:** Faça login como **Aluno** (ex: aluno1@gral.com), pegue o Token, coloque no cadeado e tente dar um `POST /midias`.
- **Resultado Esperado:** HTTP 403 Forbidden com a mensagem: `"Apenas a equipe interna pode fazer upload de mídias."` (Protege a base contra uploads indevidos).

### ❌ Teste 1.3: Upload de Arquivo Proibido
- **Ação:** Faça login como **Equipe Interna** (admin@gral.com), vá no `POST /midias`. Preencha os campos e tente subir um arquivo de texto `.txt` ou `.pdf`.
- **Resultado Esperado:** HTTP 400 Bad Request com a mensagem: `"Apenas imagens ou vídeos permitidos!"`.

### ❌ Teste 1.4: Payload Incompleto
- **Ação:** Como Equipe Interna, tente dar um `POST /midias` sem selecionar nenhum arquivo (`file`), apenas com o `eventoId`.
- **Resultado Esperado:** HTTP 400 Bad Request dizendo que o arquivo é obrigatório.

---

## ✅ Bateria 2: Fluxo Principal de Sucesso (O Caminho Feliz)

### 🟢 Teste 2.1: Envio Correto (Admin)
- **Ação:** Como **Equipe Interna** (logada com admin@gral.com), chame o `POST /midias`.
  - `eventoId`: 1 (ou o ID do evento que você criou)
  - `tipo`: "foto"
  - `titulo`: "Minha Formatura"
  - `altText`: "Foto dos formandos sorrindo"
  - `file`: Escolha um arquivo JPG/PNG.
- **Resultado Esperado:** HTTP 201 Created. A foto será salva na pasta `./uploads/midias`.

### 🟢 Teste 2.2: Atualizar Dados (PATCH)
- **Ação:** Pegue o ID da mídia retornada no teste acima. Vá na rota `PATCH /midias/:id`.
  - Mande um JSON atualizando o título: `{ "titulo": "Título Corrigido" }`.
- **Resultado Esperado:** HTTP 200 OK. A resposta mostrará a mídia com o novo título.

---

## 🔒 Bateria 3: Validação de Regra de Negócio Crítica (RN02)

O aplicativo exige que o aluno veja apenas as mídias da sua Turma.

### 🟢 Teste 3.1: Isolamento de Turma (Visão do Aluno)
- **Ação:** Remova o Token de Admin do cadeado. Faça Login como **Aluno** (ex: aluno1@gral.com, que é da Turma 1). Coloque o novo Token.
- **Ação:** Faça um `GET /midias`.
- **Resultado Esperado:** HTTP 200 OK. A lista de mídias retornada conterá **apenas** as fotos atreladas à Turma 1. Não aparecerá dados de outras turmas. 

### 🟢 Teste 3.2: O Motor de Busca (Filtros)
- **Ação:** Ainda como Aluno, chame `GET /midias?tipo=video`.
- **Resultado Esperado:** A lista retornará vazia `[]` se você não tiver feito upload de vídeos, provando que o filtro da API funciona dinamicamente.

---

## 📦 Bateria 4: Teste de Compactação (O ZIP)

### 🟢 Teste 4.1: Gerador de ZIP
- **Ação:** Com o Token do Aluno, teste o `GET /midias/download-zip?tipo=foto`.
- **Resultado Esperado:** HTTP 200 OK. O Swagger tentará mostrar um bloco de caracteres indecifráveis (binário), o que comprova que a API capturou as fotos da Turma, compactou e devolveu um arquivo `midias-foto.zip`. 
*(O teste final real do ZIP ocorrerá com o Botão de Download na interface do Expo Go).*
