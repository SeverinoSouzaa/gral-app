# Conclusão do Módulo 1: Autenticação e Seed

Desenvolvemos com sucesso toda a fundação de segurança e geração de usuários do seu backend, sem tocar em nenhuma linha do frontend React Native.

## O Que Foi Implementado

1. **Seed Automático (`seed.ts`)**: Um script seguro que gerou o primeiro cenário real no banco de dados (Turma de Eng. de Software, 1 Admin e 1 Formando). 
2. **DTO e Validação (`login.dto.ts`)**: Implementação do Payload que garante que ninguém consiga enviar logins quebrados (tudo validado pelo `class-validator`).
3. **Módulo de Usuários e Autenticação**: Criação da criptografia que compara senhas com `Bcrypt` e do passaporte de segurança que emite o `Token JWT` com validade de 1 dia.
4. **Documentação Automática (Swagger)**: A rota `POST /api/v1/auth/login` já está decorada e interativa!

---

## 🛠️ Passo a Passo para Teste (Sua Vez!)

Como prometido, aqui está o guia exato de como você, no seu ambiente, pode testar o que acabamos de construir sem precisar de conhecimentos avançados.

> [!NOTE]
> Você já está rodando o PostgreSQL. Abra seu terminal (PowerShell ou VSCode) dentro da pasta `backend-app` e siga estes passos na ordem:

### Passo 1: Ligar o Servidor Backend
No terminal do `backend-app`, digite:
```bash
npm run start:dev
```
*Isso vai ligar a API na sua máquina localmente (Porta 3000).*

### Passo 2: Acessar a Documentação Visual
Abra o seu navegador de internet (Chrome, Edge, etc) e acesse esta URL exata:
[http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

*Você verá uma página limpa do Swagger chamada "GRAL API".*

### Passo 3: Fazer o Login como Formando
1. Na tela do Swagger, clique para expandir a aba verde **POST /auth/login**.
2. Clique no botão **"Try it out"** (no canto direito superior da caixa).
3. Na caixa de texto (Request body), cole exatamente este JSON:
```json
{
  "email": "joao@estudante.com",
  "senha": "123456"
}
```
4. Clique na grande barra azul **Execute**.

### Passo 4: Validar o Sucesso (A Mágica)
Role um pouco para baixo e veja o **Server Response**.
Se tudo correu bem, você verá um código `200` e no "Response body" aparecerá o seu cobiçado **Token JWT**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "usuario": {
    "id": 2,
    "nome": "João Formando",
    "email": "joao@estudante.com",
    "tipoUsuario": "STUDENT"
  }
}
```

> [!TIP]
> Você também pode testar o login do Administrador mudando o email no passo 3 para: `admin@gral.com.br` com a mesma senha `123456`.

Faça os testes e, assim que você me der a sua aprovação de que tudo funcionou perfeitamente no Swagger, nós daremos o "check" neste Módulo de Autenticação e poderemos planejar o próximo!
