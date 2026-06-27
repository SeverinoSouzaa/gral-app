# Manual Oficial de Instalação, Configuração e Demonstração - GRAL

Este documento é o guia definitivo para demonstrar o sistema GRAL a partir de uma máquina "zerada". Siga este passo a passo cronológico para garantir que a arquitetura em nuvem funcione perfeitamente com as interfaces locais durante sua apresentação.

> [!IMPORTANT]
> **Antes de começar (Para o Desenvolvedor):**  
> Todas as alterações necessárias já foram feitas! O código do frontend mobile foi fixado para apontar para a Nuvem, e os commits foram enviados para o GitHub. A atualização em tempo real (EAS) também foi disparada. Não é preciso configurar IP local para a demonstração final!

---

## 1. Visão Geral da Arquitetura de Demonstração

Para esta apresentação, a infraestrutura funcionará da seguinte forma:

```mermaid
graph TD
    A[Celular c/ Expo Go] -->|Requisições HTTP| B(Backend em Nuvem - Render)
    C[Frontend Web Local] -->|Requisições HTTP| B
    B <-->|Prisma ORM| D[(Banco Supabase em Nuvem)]
    E[Prisma Studio Local] <-->|Visualização Direta| D
    F[Swagger em Nuvem] <-->|Testes e Docs| B
```

- **Celular (Expo Go)**: Roda o frontend-app, conectado 100% à nuvem.
- **Frontend Web (Painel Admin)**: É o único projeto que vai rodar **localmente** (`localhost:5173`), mas consumindo a API na nuvem.
- **Backend (Render)**: Hospeda a regra de negócios e o Swagger, rodando de forma independente na nuvem.
- **Banco de Dados (Supabase)**: Hospeda os dados em produção.
- **Prisma Studio**: Vai rodar localmente apenas para espiar as tabelas do Supabase em tempo real.

---

## 2. Pré-requisitos da Máquina (Checklist de Instalação)

Se a máquina estiver 100% zerada, você precisará instalar:

- [x] **[Git](https://git-scm.com/downloads)** (Para clonar o projeto)
- [x] **[Node.js](https://nodejs.org/)** (LTS recomendado. Para rodar o Frontend Web e dependências)
- [x] **[Visual Studio Code](https://code.visualstudio.com/)** (Para abrir os arquivos)
- [x] **[Expo Go](https://expo.dev/client)** (Instale no seu iPhone via App Store)
- [x] **Navegador Chrome/Edge/Firefox**

> [!TIP]
> Instale tudo aceitando as configurações padrão (`Next > Next > Install`).

---

## 3. Clonando o Projeto

1. Abra o Terminal (ou Prompt de Comando/PowerShell).
2. Execute o comando para baixar o projeto:
   ```bash
   git clone https://github.com/SeverinoSouzaa/gral-app.git
   ```
3. Entre na pasta criada:
   ```bash
   cd gral-app
   ```
4. Abra o projeto no VS Code:
   ```bash
   code .
   ```

---

## 4. Configuração das Variáveis de Ambiente

> [!IMPORTANT]
> O **Frontend Web** e o **Frontend App** já estão configurados no código para mirar na URL da API publicada (`https://gral-api.onrender.com/api/v1`). Eles **não precisam** de arquivos `.env`.

Para rodarmos o **Prisma Studio** (visão do banco), precisamos configurar a pasta do backend:

1. No VS Code, entre na pasta `backend-app`.
2. Crie um arquivo chamado exatamente `.env`
3. Cole o seguinte conteúdo (URL oficial do seu Supabase):

```env
DATABASE_URL="postgresql://postgres:settbancogral@db.djsnjtngkldmzzhkixkg.supabase.co:5432/postgres"
JWT_SECRET="gral_secret_super_secure_key_2026"
```

---

## 5. Preparando o Ambiente (Instalando Dependências)

Como usaremos apenas a nuvem, não precisamos dar "start" no backend, mas precisamos instalar as dependências para rodar a Web e o Prisma Studio.

### Na pasta Backend (Para o Prisma Studio):
1. Abra um terminal e vá para o backend:
   ```bash
   cd backend-app
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Sincronize o Prisma:
   ```bash
   npx prisma generate
   ```

### Na pasta Frontend Web (Painel Admin):
1. Abra uma **nova guia** no terminal e vá para o painel web:
   ```bash
   cd web-project
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```

---

## 6. Roteiro da Demonstração ao Professor

Este é o roteiro **passo a passo** que você deve seguir falando e mostrando durante a apresentação.

### Passo 1: Mostrar o Repositório e Clonagem
- Abra o GitHub e mostre que o código está versionado.
- Mostre o processo de `git clone` feito na etapa 3.

### Passo 2: Mostrar a Nuvem (Supabase, Backend e Swagger)
- **Supabase**: Acesse o painel do Supabase no navegador para mostrar que o projeto está hospedado em nuvem real.
- **Swagger**: Acesse a documentação viva da API em:
  🔗 **https://gral-api.onrender.com/api/v1/docs**
- Mostre um Endpoint no Swagger para provar que o Backend já está rodando sozinho.

### Passo 3: Rodar e Mostrar o Prisma Studio
- Volte ao terminal do `backend-app`.
- Inicie a visualização do banco de dados executando:
  ```bash
  npx prisma studio
  ```
- O navegador abrirá em `http://localhost:5555`. Mostre as tabelas vazias ou com os testes atuais.

### Passo 4: Rodar o Frontend Web (Painel Admin)
- No terminal do `web-project` que você preparou, execute:
  ```bash
  npm run dev
  ```
- Segure `Ctrl` e clique no link `http://localhost:5173` (ou a porta que o Vite abrir).
- **Atenção**: Este painel está rodando local na máquina, mas salvando/buscando tudo no **Supabase via Render**!
- Faça o login padrão ou navegue pelas abas financeiras e turmas.

### Passo 5: Rodar o Aplicativo (Expo)
- Para o app do aluno não precisamos instalar `npm install` caso esteja usando o celular. Basta iniciar via web ou QR code (como você prefere usar o iPhone).
- Se for rodar do zero:
  1. Abra um **terceiro terminal**.
  2. `cd frontend-app`
  3. `npm install`
  4. `npx expo start`
- Abra o aplicativo Câmera no iPhone, leia o QR Code e abra no **Expo Go**.
- Mostre a Tela de Login e acesse a Dashboard.

### Passo 6: O Momento Mágico (Sincronização em Tempo Real)
Para provar ao professor que a arquitetura está interligada perfeitamente na nuvem:
1. Posicione o celular (com a aba de Pagamentos ou Dashboard do app aberta) ao lado da tela do computador.
2. No **Painel Admin Web (PC)**, vá em Financeiro > Baixa Manual.
3. Registre um pagamento.
4. Peça para o professor olhar para a tela do Celular. Em até 5 segundos, a barra verde de pagamentos subirá sozinha, sem ninguém tocar no app.
5. Mostre o **Prisma Studio** no navegador e atualize, provando que a linha do banco mudou para `PAGO`.

---

## 7. Checklist Oficial para Apresentação ao Professor

Siga para não esquecer nada no dia:
- [ ] Git funcionando e projeto clonado numa pasta vazia.
- [ ] Dependências do `backend-app` instaladas (`npm install`).
- [ ] Variável `.env` com Supabase configurada na pasta backend.
- [ ] Prisma Studio aberto e listando os dados.
- [ ] Dependências do `web-project` instaladas (`npm install`).
- [ ] Painel Admin rodando (`npm run dev`) logado.
- [ ] Swagger aberto no navegador via nuvem.
- [ ] Aplicativo aberto no iPhone.
- [ ] Tudo se comunicando com a mesma base.

---

## 8. Solução de Problemas (FAQ de Resgate Rápido)

> [!WARNING]
> Se algo der errado no momento do "ao vivo", consulte rapidamente esta tabela.

**Problema:** Erro ao instalar dependências (`npm install` não termina ou dá conflito de peer).
**Solução:** Rode `npm install --legacy-peer-deps`. Se for permissão no Windows, abra o VS Code como Administrador.

**Problema:** Swagger não abre (`Site demorou a responder` ou Error 502).
**Solução:** O Render suspende aplicações (Sleep) após 15 minutos sem uso na versão gratuita. Aguarde de 30 a 50 segundos, atualize a página (`F5`), que a API acordará.

**Problema:** Supabase não conecta ou Prisma Studio falha ao subir.
**Solução:** Verifique se copiou a string exata no `.env` do backend-app. Verifique se não cortou nenhuma aspa (`"`).

**Problema:** Expo não conecta ao ler o QR Code.
**Solução:** Garanta que o iPhone esteja conectado ao Wi-Fi. Alternativamente, pressione `s` no terminal do Expo para forçar o login por conta do Expo. Lembre-se que o App já vai buscar da nuvem, então o IP local não vai ser problema de conexão de banco.

**Problema:** Os dados da Web não carregam e aparece erro `fetch failed`.
**Solução:** O backend na nuvem pode estar dormindo (Sleep do Render). Vá no site oficial do swagger (que acorda a API) ou tente novamente em 30 segundos.

---
*Documento gerado automaticamente pela equipe de arquitetura GRAL.*
