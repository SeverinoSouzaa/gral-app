# 📅 Guia de Testes Rigorosos - Módulo de Eventos e Presença

## 🎯 Pré-requisito (Autenticação)
1. Faça Login como **Equipe Interna** (`POST /auth/login` -> admin@gral.com).
2. Coloque o JWT no cadeado verde do Swagger.

---

## 🚫 Bateria 1: Segurança e Acesso Restrito

### ❌ Teste 1.1: Aluno tentando Criar Evento
- **Ação:** Logue como Aluno e tente um `POST /eventos`.
- **Resultado:** HTTP 403 Forbidden.

### ❌ Teste 1.2: Espionagem de Turma
- **Ação:** Como Aluno (Turma 1), tente acessar um Evento Específico (`GET /eventos/:id`) que você sabe que pertence à Turma 2.
- **Resultado:** HTTP 403 Forbidden ("Você não tem permissão para acessar um evento de outra turma").

---

## ✅ Bateria 2: O Caminho Feliz Administrativo (Admin)

### 🟢 Teste 2.1: Criar o Evento
- **Ação:** Chame `POST /eventos`.
  ```json
  {
    "nomeEvento": "Studio Day de Teste",
    "dataEvento": "2026-12-15T19:00:00Z",
    "local": "UFAM",
    "descricao": "Sessão de fotos oficial",
    "eventType": "EVENT",
    "turmaId": 1
  }
  ```
- **Resultado:** HTTP 201 Created. Anote o ID gerado!

### 🟢 Teste 2.2: Atualizar Dados
- **Ação:** Chame `PATCH /eventos/:id` com o ID do teste anterior e altere o local para "Parque das Águas".
- **Resultado:** HTTP 200 OK com os dados atualizados.

---

## 👨‍🎓 Bateria 3: A Visão do Formando e Confirmação de Presença

### 🟢 Teste 3.1: O Filtro Automático de Turma
- **Ação:** Faça Login como **Aluno** e chame `GET /eventos`.
- **Resultado:** Você verá a lista de eventos da sua Turma. Repare que no JSON retornado, os dados de data (`dataEvento`) vêm puros em ISO 8601 (conforme combinado de deixar o frontend processar) e existe um campo novo na resposta: `"statusPresencaUsuario": "PENDENTE"`.

### 🟢 Teste 3.2: Confirmar Presença
- **Ação:** Ainda como Aluno, chame `POST /eventos/:id/presenca` (informe o ID do evento).
  ```json
  {
    "status": "CONFIRMADO"
  }
  ```
- **Resultado:** HTTP 201. A tabela `PresencaEvento` foi atualizada com o Upsert.
- **Prova Real:** Chame `GET /eventos` de novo. O campo `"statusPresencaUsuario"` deve ter mudado de `"PENDENTE"` para `"CONFIRMADO"`. O React Native usará isso para acender o botão verde da tela!
