# Guia Oficial de Testes - Módulo de Autenticação (Swagger)

Este guia documenta o fluxo correto para validar a segurança, os métodos HTTP e as respostas da API de Autenticação, atendendo aos rigorosos critérios do professor (Padrão REST, JSON, Status Codes, etc).

> **Acesso ao Swagger:** npm run start:dev `http://localhost:3000/api/v1/docs`

---

## 🧪 Passo Zero: Criando a Turma (Admin)

Para que alunos possam ser cadastrados, precisamos criar a Turma deles primeiro.

1. Faça o Login da Equipe Interna (conforme Teste 1 abaixo) e copie o `accessToken`.
2. Autorize o Swagger clicando no cadeado verde (Authorize) e colando o Token.
3. Vá até a seção **Turmas**.
4. Abra a rota `POST /api/v1/turmas`.
5. Clique em **Try it out** e insira:
```json
{
  "nomeTurma": "Turma de Medicina 2026",
  "curso": "Medicina",
  "anoFormatura": 2026,
  "codigoAcesso": "54321"
}
```
6. Clique em **Execute**.
7. **Resultado Esperado (201 Created):** A Turma será criada e retornará o `id` (ex: `2`). Guarde esse ID!

---

## 🧪 Teste 1: Login da Equipe Interna (Admin)

A Equipe Interna entra no sistema sem vínculo a turmas, usando apenas E-mail e Senha.

1. No Swagger, localize a seção **Autenticação**.
2. Abra a rota `POST /api/v1/auth/login/equipe`.
3. Clique em **Try it out**.
4. Insira o seguinte JSON (dados gerados pelo Seed):
```json
{
  "email": "admin@gral.com.br",
  "senha": "123456"
}
```
5. Clique em **Execute**.
6. **Resultado Esperado (200 OK):** Você receberá um `accessToken` JWT e os dados do usuário com `tipoUsuario: "ADMIN"`.
   * **Cenário de Erro (401 Unauthorized):** Tente enviar a senha errada. A API negará o acesso.
   * **Cenário de Erro (400 Bad Request):** Remova o `@` do e-mail no JSON e teste. O `class-validator` bloqueará a requisição.

---

## 🧪 Teste 2: Equipe Interna cadastrando um Novo Aluno

Pela regra de negócios real, o Admin cria o acesso para os Formandos. Precisamos usar o token gerado no passo anterior!

1. Copie o `accessToken` gerado no Teste 1.
2. Suba até o topo do Swagger e clique no botão verde **Authorize (Cadeado)**.
3. Cole o Token no campo `Bearer` e clique em **Authorize**.
4. Vá até a seção **Usuários**.
5. Abra a rota `POST /api/v1/users/formando`.
6. Clique em **Try it out** e insira:
```json
{
  "nome": "Pedro Silva",
  "cpf": "55566677788",
  "email": "pedro@estudante.com",
  "telefone": "11911112222",
  "matricula": "20260002",
  "curso": "Medicina",
  "turmaId": 2
}
```
7. Clique em **Execute**.
8. **Resultado Esperado (201 Created):** O usuário será criado e **automaticamente vinculado ao código "54321"** porque usamos o `turmaId: 2`!
   * **Cenário de Erro (403 Forbidden):** Tente fazer este request SEM o token do Admin (ou usando o token de um aluno). O *RolesGuard* bloqueará.
   * **Cenário de Erro (409 Conflict):** Tente rodar o comando duas vezes seguidas. O banco avisará que o CPF/E-mail já estão em uso.

---

## 🧪 Teste 3: Login do Novo Formando (App Flow)

Como estipulamos na pivotagem do aplicativo, formandos fazem login usando **CPF** e **Código da Turma**. Eles não precisam de senha!

1. Volte à seção **Autenticação**.
2. Abra a rota `POST /api/v1/auth/login/formando`.
3. Clique em **Try it out** e insira os dados do usuário recém criado:
```json
{
  "cpf": "55566677788",
  "codigoTurma": "54321"
}
```
4. Clique em **Execute**.
5. **Resultado Esperado (200 OK):** A API validará o CPF e descobrirá que ele pertence à Turma "54321", liberando o `accessToken`.
   * **Cenário de Erro (401 Unauthorized):** Se tentar colocar o `codigoTurma: "12345"` (que é de outra turma), o sistema rejeitará o login do aluno.
