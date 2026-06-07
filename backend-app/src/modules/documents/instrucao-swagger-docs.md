# Módulo de Documentos (Real com Prisma)

Foi finalizada a implementação completa e real do módulo de Gestão de Documentos (RF04, RF05), conectado diretamente ao banco PostgreSQL via Prisma, abolindo o mock como você ordenou.

Além disso, introduzimos a **Garantia de Isolamento de Privilégios (RN01 e RNF03)** por meio de uma proteção avançada: o `RolesGuard`. Agora o sistema não apenas checa se quem fez a requisição possui um Token válido, mas verifica exatamente *qual é o perfil da pessoa* logada.

## O Que Foi Implementado

1. **`RolesGuard`**: Um interceptador customizado que extrai do JWT o seu tipo (`STUDENT` ou `ADMIN`) e barra requisições caso você não tenha permissão.
2. **DTOs Blindados (`CreateDocumentDto` e `UpdateDocumentStatusDto`)**: Evitam envio de status maliciosos. A API apenas aceita as chaves `APPROVED` ou `REJECTED` para aprovações e o enum Prisma para os tipos (`FRAME_PHOTO`, etc).
3. **Controladores e Serviços Reais**:
   - `POST /documents`: Salva um novo documento no PostgreSQL linkado com o ID extraído do seu Token.
   - `GET /documents/me`: Retorna os documentos daquele mesmo ID.
   - `GET /documents/pendentes`: Requer o papel de `ADMIN` para listar todos os pendentes.
   - `PATCH /documents/{id}/status`: Requer o papel de `ADMIN` para aprovar.

---

## 🛠️ Passo a Passo para Validação no Swagger (Real)

Como sempre, aqui está a rota para você verificar a execução com suas próprias mãos. Seu `npm run start:dev` ainda está rodando, então as novas rotas já estão no ar.

> [!WARNING]
> Mantenha a documentação do Swagger aberta em: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

### 1º Teste: O Formando enviando e o bloqueio da RN01 (Acesso Indevido)
1. Certifique-se de estar logado como **Formando** no Swagger:
   - Use a rota de `/auth/login` com `joao@estudante.com` / `123456`.
   - Clique em **Authorize** (o cadeado no topo) e insira o Token gerado.
2. Expanda a aba de **Documentos**, vá no **POST /documents** e clique em *Try it out*.
   - Use o JSON de envio:
   ```json
   {
     "nomeArquivo": "foto_canudo_joao.jpg",
     "tipoDocumento": "CAP_NAME"
   }
   ```
   - Clique em **Execute**. Você verá o retorno sucesso (status `PENDING` armazenado na tabela real do banco).
3. **Agora vamos testar a Segurança (RN01):** Ainda logado como o formando João, vá na rota verde escuro **PATCH /documents/{id}/status**.
   - Coloque `1` no `id`.
   - Tente alterar o status para `APPROVED` e clique em **Execute**.
   - 🛡️ **O Resultado:** Você levará um belo erro HTTP `403 Forbidden` informando: *"Acesso negado. Apenas a Equipe Interna pode executar esta ação."*

### 2º Teste: A Equipe Interna Aprovando (RF05)
1. Deslogue o formador João (Clique no cadeado no topo e depois em *Logout*).
2. Faça um novo login no `/auth/login` usando o email da Equipe Interna: `admin@gral.com.br` / `123456`. Copie o token.
3. Clique em **Authorize** e insira o novo token.
4. Volte à rota **PATCH /documents/{id}/status**.
   - Coloque `1` no `id`.
   - Modifique o status para `APPROVED`.
   - Clique em **Execute**.
   - ✅ **O Resultado:** O status HTTP `200 OK` aparecerá, provando que o Admin possui a chave `Roles('ADMIN')` para editar e o status do documento 1 acabou de virar aprovado no seu PostgreSQL.
