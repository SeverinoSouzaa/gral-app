# 🚀 Manual Absoluto de Setup do Projeto GRAL

Este é o **Guia Definitivo e à Prova de Falhas** para clonar, configurar e rodar o aplicativo de Gestão de Formaturas (GRAL) em uma máquina **completamente nova** e zerada (ex: um notebook recém formatado na rede Wi-Fi da universidade).

Ao seguir exatamente cada passo abaixo, você conseguirá colocar o Banco de Dados, o Backend (API) e o Frontend (Aplicativo Mobile) no ar, rodando no seu próprio celular, para realizar testes ou apresentações.

---

## 🛠️ Passo 0: Pré-requisitos (Download dos Softwares)
Antes de baixar o código do projeto, precisamos das ferramentas base instaladas na máquina nova. Acesse os links e instale com as configurações padrões (Next, Next, Install):

1. **Node.js (LTS Version):** [https://nodejs.org/pt](https://nodejs.org/pt) (Esta é a engine onde o Backend e Frontend rodam).
2. **PostgreSQL:** [https://www.postgresql.org/download/](https://www.postgresql.org/download/) (Banco de Dados).
   - *ATENÇÃO DURANTE A INSTALAÇÃO:* Ele pedirá para criar uma **senha**. Guarde bem essa senha! Ela é obrigatória para conectar o aplicativo ao banco. Certifique-se de marcar a opção de instalar também o **pgAdmin 4** (Vem marcado por padrão).
3. **GitHub Desktop:** [https://desktop.github.com/](https://desktop.github.com/) (Para baixarmos o código para o PC).
4. **Visual Studio Code (VS Code):** [https://code.visualstudio.com/](https://code.visualstudio.com/) (Editor de código onde faremos os ajustes de rede).
5. **No seu Celular:** Instale o aplicativo **Expo Go** (disponível de graça na App Store e Google Play).

---

## 📂 Passo 1: Clonando o Projeto na Máquina
Vamos resgatar nosso projeto completo que está salvo na nuvem (GitHub).

1. Abra o **GitHub Desktop**.
2. Faça Login com a sua conta do GitHub.
3. Clique no botão azul gigante: **"Clone a repository from the Internet"** (Clonar repositório).
4. Na aba "GitHub.com", busque pelo nosso repositório `SeverinoSouzaa/gral-app`.
5. Em *Local Path* (Caminho local), escolha onde salvar (ex: `C:\Users\SuaConta\Documents\gral-app`).
6. Clique no botão azul **Clone**. Aguarde a barra carregar.
7. Pronto! Os arquivos do projeto já estão no seu notebook! No GitHub Desktop, clique no atalho **"Open in Visual Studio Code"**.

---

## 🗄️ Passo 2: Preparando o Banco de Dados
Sem um local para armazenar dados, o aplicativo não funciona.

1. Abra o Menu Iniciar do Windows e digite **pgAdmin 4**. Abra ele.
2. No menu esquerdo, expanda `Servers` > `PostgreSQL 14` (ou a versão que instalou).
3. Ele vai pedir aquela senha que você criou na instalação. Digite-a.
4. Clique com o botão direito do mouse em **Databases** > **Create** > **Database...**
5. No campo *Database*, digite exatamente: `gral_db` e clique em **Save**.
6. Perfeito! O "terreno vazio" está comprado. O resto quem constrói é o nosso código. Pode minimizar o pgAdmin.

---

## ⚙️ Passo 3: Configurando e Ligando o Backend (O Núcleo)
O Backend gerencia as regras de negócio, a segurança e a criação das tabelas no banco de dados recém criado.

### 3.1: Instalação das dependências
1. No VS Code, abra o terminal no menu superior: `Terminal` > `New Terminal`.
2. O terminal vai abrir na pasta raiz `gral-app`. Precisamos entrar no backend:
   Digite: `cd backend-app` e dê **Enter**.
3. Agora vamos instalar todas as pecinhas do backend.
   Digite: `npm install` e dê **Enter**. Aguarde acabar (pode levar 1 ou 2 minutos).

### 3.2: O Arquivo de Segredos (.env)
1. Ainda no VS Code, abra a pasta `backend-app` na barra da esquerda.
2. Note que existe um arquivo chamado `.env.example`.
3. Clique com o botão direito numa área vazia da barra lateral (dentro da pasta backend) e crie um **Novo Arquivo** (`New File`) chamado exatamente de `.env`.
4. Copie e cole dentro do `.env` o seguinte conteúdo:
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/gral_db"
JWT_SECRET="gral_secret_super_secure_key_2026"
```
5. **ATENÇÃO MÁXIMA:** Substitua a palavra `SUA_SENHA_AQUI` pela senha real que você configurou ao instalar o PostgreSQL!
6. Salve o arquivo (Ctrl+S).

### 3.3: Construindo as Tabelas (Migrações)
1. Volte ao terminal (que ainda está em `backend-app`).
2. Digite: `npx prisma db push` e dê **Enter**.
3. Uma mágica acontecerá: o Prisma lerá nosso código e criará automaticamente dezenas de tabelas organizadinhas (Formandos, Eventos, Mídias, etc) dentro do seu `gral_db` vazio!

*(Opcional mas recomendado)*: Se você quiser testar as telas do aplicativo mas estiver sem saco para criar usuários do zero no Swagger, rode: `npx prisma db seed`. Isso vai popular o banco com alguns dados base caso exista um script `seed.ts` configurado.

### 3.4: Ligando o Motor!
1. No mesmo terminal do `backend-app`, digite: `npm run start:dev` e dê **Enter**.
2. Aparecerão dezenas de linhas verdes terminando com um sorridente "Nest application successfully started".
3. **Não feche esse terminal!** O Backend está rodando (servindo na porta 3000).

### 3.5: Teste Real do Backend e Painéis Auxiliares
- **Testar as APIs:** Abra o seu navegador (Chrome/Edge) e acesse: `http://localhost:3000/api/v1/docs`.
  *Boom!* A tela do **Swagger** abrirá. Todo o nosso projeto documentado, pronto para testes de envio de foto, aprovação de documentos e gestão de eventos.
- **Painel de Controle Visual:** Quer ver os dados que os usuários estão criando diretamente nas tabelas? Abra **UM NOVO TERMINAL** no VS Code (`Terminal` > `New Terminal`), digite `cd backend-app` e depois: `npx prisma studio`. Isso abrirá no navegador uma tela onde você tem acesso total a todos os registros de todas as tabelas!

---

## 📱 Passo 4: Configurando e Ligando o Frontend (Aplicativo Mobile)
Atenção: Diferente do Swagger (que roda no próprio notebook), o aplicativo vai rodar em um celular e precisa saber a exata localização (IP) do seu notebook na rede Wi-Fi da faculdade.

### 4.1: Descobrindo seu IP da Universidade
1. No Windows da máquina nova, aperte a tecla `Win + R`, digite `cmd` e dê Enter.
2. Uma tela preta abrirá. Digite `ipconfig` e dê Enter.
3. Procure pela linha **"Endereço IPv4"** (ex: `192.168.0.106` ou `10.0.0.15`). Anote esse número!

### 4.2: Apresentando o Celular ao Servidor
1. No VS Code, abra o arquivo `frontend-app/src/services/api.ts`.
2. Na linha 16, você encontrará o endereço `BASE_URL = 'http://X.X.X.X:3000/api/v1';`.
3. Substitua aquele número (`X.X.X.X`) pelo **IPv4** que você acabou de anotar. Mantenha os `:` e as barras exatamente onde estão. Salve o arquivo!

### 4.3: Instalando e Ligando
1. Abra um **terceiro terminal** no VS Code.
2. Navegue para a pasta do frontend: `cd frontend-app`
3. Baixe as engrenagens: `npm install` (Aguarde...).
4. Mande rodar: `npx expo start` e dê **Enter**.
5. Um **QR Code** gigante aparecerá no seu terminal!

---

## 🎯 Passo 5: A Grande Demonstração (The Grand Finale)
Está na hora de ver a obra de arte rodando nativamente nas suas mãos.

1. Pegue o seu smartphone (tem que estar conectado na **mesma rede Wi-Fi** da faculdade que o notebook!).
2. Abra o aplicativo **Expo Go**.
3. Se você usar **Android:** Clique em *"Scan QR Code"* dentro do próprio Expo Go e aponte para a tela do computador.
4. Se você usar **iPhone (iOS):** Abra a Câmera nativa do iPhone, aponte pro QR Code do computador e clique no link amarelo que surgir "Abrir no Expo Go".
5. A barra de carregamento azul do Expo preencherá a tela (Building Javascript bundle...).
6. **BAM!** A bela tela de login com gradiente do GRAL aparecerá no seu celular, pronta para logar e se comunicar em tempo real com o PostgreSQL que está no notebook.

**Aproveite as Apresentações e Testes! 🚀 Tudo foi arquitetado com suor e carinho para escalar.**
