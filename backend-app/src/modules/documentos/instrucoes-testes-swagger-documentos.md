# Guia Oficial de Testes - Módulo de Documentos (Swagger)

Este guia documenta como simular o envio de Documentos pelo Formando e a Aprovação pela Equipe Interna no padrão arquitetural validado.

> **Acesso ao Swagger:** `http://localhost:3000/api/v1/docs`

---

## 📸 Teste 1: Formando Enviando "Nome do Canudo" (Sem Arquivo)

1. Faça o Login com um aluno (`joao@estudante.com` / `123456`) e copie o `accessToken`.
2. Autorize o Swagger (Cadeado Verde).
3. Vá em **Documentos** -> `POST /api/v1/documentos`.
4. Clique em **Try it out**.
5. No formulário:
   - **tipoDocumento**: Escreva `CAP_NAME`
   - **valorConteudo**: Escreva o nome desejado (Ex: `João da Silva Canudo`)
   - **file**: Deixe vazio (não anexe nada).
6. **Execute**. 
7. **Resultado Esperado (201 Created):** O documento será salvo com `status` = `"PENDENTE"` e o `nomeArquivo` = `"TEXTO_APENAS"`.

---

## 📸 Teste 2: Formando Enviando "Foto do Quadro" (Upload de Imagem)

1. Mantenha-se logado com o Aluno.
2. Na mesma rota `POST /api/v1/documentos`.
3. No formulário:
   - **tipoDocumento**: Escreva `FRAME_PHOTO`
   - **valorConteudo**: (Deixe em branco ou remova)
   - **file**: Clique em "Choose File" e escolha uma imagem `.jpg` ou `.png` do seu computador.
4. **Execute**. 
5. **Resultado Esperado (201 Created):** O arquivo será salvo fisicamente na pasta `uploads/documentos` do Backend e cadastrado no banco como `"PENDENTE"`.

---

## 👨‍💼 Teste 3: Equipe Interna Listando Documentos

A regra de negócio determina que o Formando não aprova os próprios documentos. Vamos testar a Equipe Interna.

1. Faça Login com o Admin (`admin@gral.com.br` / `123456`) e coloque o novo `accessToken` no cadeado verde do Swagger.
2. Vá em **Documentos** -> `GET /api/v1/documentos`.
3. **Execute**.
4. **Resultado Esperado (200 OK):** O Admin verá todos os documentos de todos os alunos, incluindo o Nome do Canudo e a Foto do Quadro que o "João" acabou de mandar. Copie o `id` de um desses documentos.

---

## ✅ Teste 4: Equipe Interna Aprovando o Documento

1. Mantenha-se logado como Admin.
2. Vá na rota `PATCH /api/v1/documentos/{id}/status`.
3. Coloque o `id` do documento copiado anteriormente.
4. No corpo (JSON), envie:
```json
{
  "status": "APROVADO"
}
```
5. **Execute**.
6. **Resultado Esperado (200 OK):** O status do documento vai de `"PENDENTE"` para `"APROVADO"`. 
   > *Obs: Nos bastidores, o NestJS disparou um Evento de Notificação via Observer pattern (`documento.status.alterado`), que será usado futuramente pelo Módulo de Notificações para avisar o celular do Aluno!*

---

## 🚫 Teste 4.1: Equipe Interna Rejeitando o Documento

1. Mantenha-se logado como Admin.
2. Na mesma rota `PATCH /api/v1/documentos/{id}/status`.
3. Coloque o mesmo `id` ou de outro documento pendente.
4. No corpo (JSON), envie:
```json
{
  "status": "REJEITADO",
  "motivoRejeicao": "A foto está ilegível e borrada. Envie novamente."
}
```
5. **Execute**.
6. **Resultado Esperado (200 OK):** O status vai para `"REJEITADO"` e o banco salvará o `motivo_rejeicao`. O evento emitido também enviará esse motivo para a notificação do aluno!
