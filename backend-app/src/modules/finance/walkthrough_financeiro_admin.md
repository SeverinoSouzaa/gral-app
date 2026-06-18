# Guia de Validação: Módulo Financeiro Admin via Swagger

Conforme o seu pedido para que o módulo financeiro seja um sistema impenetrável e 100% testável antes de se conectar ao Frontend, eu finalizei a refatoração. 

O servidor local atualizado já está rodando (recomendo que, se o seu terminal esteve rodando o tempo todo durante essas alterações, você pare e rode `npm run start:dev` novamente para carregar os códigos novos).

Abaixo está o roteiro de testes (Quebra/Estresse) para você executar no **[Swagger (http://localhost:3000/api)](http://localhost:3000/api)**.

---

## 1. Login
Tanto o Formando quanto a Equipe Interna (Admin) precisam estar logados para testar.
- Vá no módulo `Auth` > `POST /auth/login`.
- Faça login com um e-mail de Admin (Equipe Interna).
- Copie o `access_token` gerado, suba até o topo do Swagger, clique no botão **Authorize** (Cadeado Verde) e cole o token.

## 2. Testando a Criação de Parcelas para uma Turma
Nenhuma cobrança manual será feita um-a-um. O Admin cobra por turma.
- Vá no módulo `Financeiro - Admin`.
- Abra a rota **`POST /finance/admin/turmas/{turmaId}/gerar-parcelas`**.
- Coloque o ID de uma turma que já possui formandos (ex: `1`).
- No **Body**, coloque as regras de cobrança. Exemplo:
```json
{
  "valorTotalPorAluno": 1300,
  "quantidadeDeParcelas": 12,
  "dataVencimentoInicial": "2026-07-10"
}
```
> [!NOTE]
> O Backend automaticamente vai calcular `1300 / 12 = 108.33` e vai criar 12 boletos/parcelas PIX para *todos* os alunos que estiverem vinculados à turma `1`.

## 3. Teste do Aplicativo (Simulando o Celular via Swagger)
- Agora, faça o `POST /auth/login` novamente, mas com o email de um **Formando** dessa turma.
- Pegue o novo token e clique no botão **Authorize** para trocar o token do Admin pelo token do Aluno.
- Vá no módulo `Financeiro` e teste o **`GET /finance`** (Resumo Financeiro). 
- **O que você deve ver:** Um relatório mostrando que ele tem 12 parcelas pendentes e o seu "Status" é Em Dia. O Frontend App consome exatamente essa mesma rota. E caso você crie um formando numa turma que ainda não tem parcelas, vai retornar arrays vazios `[]`, o que o App agora suporta perfeitamente exibindo "Nenhuma parcela pendente".

## 4. Simulando a "Baixa" e a Inteligência de Atraso
- Volte a usar o **Token do Admin**.
- Vá na rota **`GET /finance/admin/turmas/{turmaId}/visao-geral`**.
  - Você verá o raio-x da turma: quem está devendo, quantos alunos estão adimplentes, o CPF de cada um e o total já arrecadado (que estará zerado).
- Vá na rota **`PATCH /finance/admin/formandos/{formandoId}/parcelas/{numeroParcela}/baixa-manual`**.
  - Digite o ID do Formando e o Número da Parcela (ex: parcela `1` ou `2`).
  - Isso simula um pagamento "por fora" (Dinheiro) ou um teste rápido de compensação sem gastar dinheiro real no Mercado Pago.
- Volte no **`GET /visao-geral`** e no **`GET /resumo`**.
  - Agora você verá a Arrecadação mostrar o dinheiro entrando (classificado como "viaDinheiroManual").
  - O Formando em questão terá 1 parcela paga e 11 pendentes.

---

### Por que a fatura parou de "sumir sozinha"?
Eu removi a trapaça do Backend. Antes, quando o formando clicava em "Pagar PIX", o banco marcava como pago instantaneamente. Agora, quando ele clica no botão, o Backend apenas entra em contato com o Mercado Pago e devolve a "imagem" (Base64) e o "Texto Copia e Cola", mantendo o status `PENDENTE`. 
A fatura só ficará verde se o Admin der a *Baixa Manual* via Swagger, ou, no futuro ambiente em Nuvem, se o Mercado Pago enviar uma mensagem (Webhook) avisando que o dinheiro caiu.

> [!TIP]
> Todo o lixo de integração antiga (EFI Bank) foi apagado. O módulo está enxuto e pronto para suportar o painel administrativo na Web no futuro. Teste os endpoints e tente quebrar a lógica! Se estiver satisfeito, basta reiniciar seu celular no Expo Go para ver que a parcela continua lá (pendente) mesmo após gerar o PIX!
