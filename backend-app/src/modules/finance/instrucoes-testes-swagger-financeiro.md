# Guia Oficial de Testes - Módulo Financeiro (Swagger)

Este guia documenta como simular os pagamentos do Formando e visualizar seu extrato, seguindo o padrão arquitetural de isolamento (Estratégias EFI/Cartão) e regras de segurança (O Formando só vê o próprio saldo).

> **Acesso ao Swagger:** `http://localhost:3000/api/v1/docs`

---

## 🧾 Teste 1: O Formando verificando seu Saldo
Vamos simular o momento em que o aplicativo solicita o Resumo Financeiro ao abrir a tela de "Pagamentos".

1. **Faça o Login:** Use a rota `POST /auth/login/formando` com um aluno (ex: `joao@estudante.com` / `123456`) e copie o `accessToken`.
   *(Se não houver usuário criado, crie no Prisma Studio e gere as parcelas para ele).*
2. **Autorize o Swagger** clicando no Cadeado Verde e colando o Token.
3. Vá em **Financeiro** -> `GET /api/v1/finance`.
4. Clique em **Try it out** e depois em **Execute**.
5. **Resultado Esperado (200 OK):** O sistema deve retornar um JSON impecável contendo 3 blocos:
   - `resumo`: Com os totais `totalPago`, `totalPendente` e `statusAtual`.
   - `pendentes`: A lista de parcelas que ainda vão vencer. **Copie o ID de uma parcela pendente**.
   - `historico`: Parcelas já pagas (se houver).

---

## 💸 Teste 2: Gerando um Pix via API (Estratégia MOCK/EFI)
O formando decidiu pagar aquela parcela. O nosso backend acionará a EFI Bank (ou o Mock) e gerará o QR Code seguro.

1. Mantenha-se logado com o mesmo Aluno.
2. Vá na rota `POST /api/v1/finance/{id}/pay`.
3. Em `id`, cole o número da parcela pendente que você copiou no Teste 1.
4. No campo do `body` (JSON), envie:
```json
{
  "formaPagamento": "PIX",
  "valor": 75.00
}
```
*(Lembre-se: o valor deve ser igual ou superior ao valor real da parcela no banco de dados).*
5. **Execute**.
6. **Resultado Esperado (201 Created):** 
   - O status no banco muda instantaneamente para `"PAGO"`.
   - O JSON de retorno trará o bloco `"transacaoGateway"` com a imagem Base64 do QR Code e a chave Copia-e-Cola!
   - *(Se a EFI Bank não estiver conectada, ele trará um MOCK com um QR code genérico sem quebrar o sistema!)*

---

## 🛡️ Teste 3: Blindagem Anti-Fraude
O que acontece se o formando tentar pagar uma parcela que já está paga?

1. Na MESMA rota de pagamento, com o mesmo `id` que você acabou de pagar no Teste 2.
2. Tente dar **Execute** novamente.
3. **Resultado Esperado (400 Bad Request):** O sistema barra a operação e exibe o erro `"Esta parcela já consta como PAGA"`.

O que acontece se enviar R$10 para uma parcela de R$75?
1. Pegue o ID de OUTRA parcela pendente.
2. Mande no body `"valor": 10`.
3. **Resultado Esperado (400 Bad Request):** O sistema bloqueia a transação por valor insuficiente.

---

## 👔 Teste 4: Visão da Equipe Interna (Admin)
Vamos testar a geração em lote de pagamentos!

1. **Faça Login como Admin:** Use `POST /auth/login/equipe` (ex: `admin@gral.com`).
2. Copie o Token e insira no Cadeado do Swagger.
3. **Gerando Contratos da Turma:** Vá em **Financeiro - Admin** -> `POST /api/v1/finance/admin/turmas/{turmaId}/gerar-parcelas`.
4. Coloque o ID de uma turma válida (ex: `1`) e mande no Body:
```json
{
  "valorTotalPorAluno": 1300.00,
  "quantidadeDeParcelas": 12,
  "dataVencimentoInicial": "2026-08-10"
}
```
5. **Resultado Esperado:** O sistema vai achar todos os alunos da turma 1 e gerar 12 parcelas para cada um, mostrando a mensagem de sucesso!

6. **Painel de Arrecadação (Dashboard):** Vá na rota `GET /api/v1/finance/admin/turmas/{turmaId}/resumo`. 
   - **Resultado Esperado:** Um JSON detalhado mostrando o `arrecadacaoTotalTurma` e um ranking `formandos` com os CPFs e o quanto cada um já pagou no total.

7. **Buscando Inadimplentes:** Vá na rota `GET /api/v1/finance/admin/turmas/{turmaId}/inadimplentes`. O sistema vai listar bonitinho todos os alunos que estão com parcela atrasada.

---

## 🪝 Teste 5: Simulando o Webhook da EFI Bank
Você pode simular que a EFI Bank está nos avisando que um Pix foi pago:
1. Vá em **Financeiro - Webhooks** -> `POST /api/v1/finance/webhook/efi/pix`.
2. Mande o body que a EFI enviaria:
```json
{
  "pix": [
    {
      "txid": "mock_txid_exemplo_123",
      "valor": "75.00"
    }
  ]
}
```
3. O servidor vai logar o recebimento no terminal instantaneamente, pronto para conciliar os dados!
