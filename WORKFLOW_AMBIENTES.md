# Guia de Sobrevivência: Os Dois Mundos do Desenvolvimento

Este guia é o seu mapa definitivo para entender como trabalhar profissionalmente em um projeto de software, separando estritamente a fase de criação da fase de entrega para o usuário final.

---

## 🌎 A Regra de Ouro: Entenda os Dois Mundos

No desenvolvimento de software moderno, nós nunca trabalhamos diretamente no sistema que os usuários estão usando. Nós dividimos a realidade em dois "mundos" completamente isolados:

### 1. O Mundo de Desenvolvimento (Local)
- **Onde vive:** No seu computador (sua máquina).
- **Banco de Dados:** O seu PostgreSQL local (`localhost:5432`).
- **Aplicativo:** O aplicativo do Expo Go rodando no seu celular pela mesma rede Wi-Fi.
- **Regra:** É o seu laboratório. Aqui você pode errar, excluir tabelas, testar senhas como `1234`, criar dados absurdos e quebrar o código. **Ninguém fora do seu quarto é afetado por isso.**

### 2. O Mundo de Produção (A Nuvem)
- **Onde vive:** Nos servidores da internet (Render, Supabase, EAS).
- **Banco de Dados:** O Supabase (`pooler.supabase.com`).
- **Aplicativo:** O arquivo `.apk` final instalado no celular da professora ou dos clientes.
- **Regra:** É o ambiente sagrado. Aqui ficam os dados reais. Nós nunca apagamos coisas para "testar" em produção e nunca apontamos nosso código local com falhas para esse banco de dados.

---

## 🛠️ Passo a Passo Prático: Como Desenvolver um Módulo Novo

Sempre que você for criar uma funcionalidade nova (Exemplo: "Módulo de Pagamentos Financeiros"), você deve seguir **exatamente esta ordem**:

### Passo 1: Preparar o Laboratório (Desenvolvimento Local)
Antes de escrever qualquer linha de código, garanta que você está isolado do mundo real.
1. Abra o arquivo `backend-app/.env`.
2. Verifique se o `DATABASE_URL` está apontando para o seu **localhost**. *(Nunca deixe a URL do Supabase aqui enquanto estiver programando o dia a dia!)*.
3. Inicie seu banco de dados local (via Docker ou pgAdmin).
4. Rode a API localmente: `npm run start:dev`.

### Passo 2: Construir e "Quebrar"
1. Crie suas tabelas no `schema.prisma` e rode `npx prisma migrate dev`.
2. Crie seus Controllers, Services e DTOs.
3. **Teste no Swagger Local:** Abra `http://localhost:3000/api/v1/docs`. Faça requisições vazias, envie dados errados propositalmente para ver se os DTOs bloqueiam.
4. **Construa as Telas:** Vá para a pasta `frontend-app`, rode `npx expo start`. O aplicativo no seu Expo Go vai ler o `__DEV__` e bater na sua API Local.
5. **Comite sem medo:** Vá fazendo *commits* a cada avanço.
   - `git commit -m "feat: cria rota de pagamento"`
   - `git commit -m "fix: corrige bug no calculo da taxa"`
   - `git commit -m "feat: adiciona tela de pagamento"`

### Passo 3: O Check-out (Aprovação)
O módulo está pronto? Ele funciona perfeitamente na sua máquina? As telas estão bonitas no Expo Go? 
Se a resposta for sim, é hora de passar esse módulo do "Laboratório" para o "Mundo Real".

1. Garanta que todas as suas alterações locais foram "commitadas".
2. Rode o comando supremo de entrega:
   ```bash
   git push
   ```

### Passo 4: A Mágica da Nuvem (Deploy Contínuo)
Ao dar o `git push`, a mágica profissional acontece automaticamente sem que você encoste na nuvem:

1. O **Render** percebe que o seu GitHub foi atualizado.
2. O Render baixa seu código novo e roda o `npm run build`.
3. *(Opcional)* Se você criou tabelas novas no Prisma, o seu comando de deploy no Render vai criar essas tabelas lá no Supabase.
4. O Render desliga a API velha e liga a API nova em questão de milissegundos.
5. **Pronto! A API de Produção já tem a funcionalidade de Pagamentos.**

### Passo 5: Como o Usuário Final recebe isso?
Isso depende do que você alterou no seu código:

#### Cenário A: Você mudou APENAS o Backend (Regras de negócio, consertou um bug na API)
- **O que fazer no aplicativo?** Nada!
- O aplicativo APK que já está baixado no celular da professora continua o mesmo, mas quando ele fizer uma requisição pela internet, a API do Render já vai responder com a lógica corrigida. Isso é maravilhoso!

#### Cenário B: Você criou Telas Novas ou mudou o visual do Frontend
- O código do aplicativo que está instalado no celular da professora não tem as telas novas desenhadas.
- **O que fazer:** Você precisará abrir a pasta `frontend-app` e gerar uma nova versão oficial:
  ```bash
  eas build -p android --profile preview
  ```
- O Expo vai gerar um **NOVO arquivo `.apk`**.
- Você avisa a professora: *"Professora, saiu a versão 2.0 do app! Baixe este novo APK"*. Ao instalar, o celular dela vai substituir o app antigo pelo novo, contendo as telas novas que já estão conversando com a API nova.

---

## ⚠️ Checklist de Prevenção de Desastres

Para não causar vazamento de dados ou quebrar o aplicativo da professora, verifique sempre estes pontos:

- [ ] **Mudei de volta o arquivo `.env`?** Depois de fazer um script ou rodar um Seed na nuvem, eu voltei a URL para o meu `localhost`?
- [ ] **A URL da API no Frontend está protegida pelo `__DEV__`?** Nunca chumbe a URL de produção sem colocar o `__DEV__ ? local : producao`, senão seus testes de interface sujarão o banco de dados oficial.
- [ ] **Eu testei todas as rotas no Swagger local antes de dar o `git push`?** O Render não testa se sua lógica faz sentido, ele só coloca no ar. Se você mandar código quebrado, a API oficial vai ficar fora do ar.

Com esta mentalidade, você é oficialmente um Engenheiro de Software Senior gerenciando ciclos de *Release*! 🚀

---

## 🧭 Guia Definitivo de Acesso e Visualização (Onde Encontrar as Coisas)

Se o professor pedir para ver "onde está rodando" cada parte do seu sistema, use esta lista como seu mapa principal. Nunca mais se perca entre o Local e a Nuvem!

### 1. Documentação da API (Os Dois Swaggers)
Sim, existem dois Swaggers e ambos podem estar funcionando ao mesmo tempo, mas eles olham para lugares diferentes:

- 🏠 **Swagger Local (Seu Laboratório):**
  - **Link:** [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)
  - **Quando usar:** Quando você estiver com o `npm run start:dev` rodando no terminal, programando um módulo novo. Tudo o que você criar aqui vai direto para o banco de dados do seu próprio PC. Ninguém de fora consegue acessar esse link.

- ☁️ **Swagger da Nuvem (O Oficial):**
  - **Link:** [https://gral-api.onrender.com/api/v1/docs](https://gral-api.onrender.com/api/v1/docs)
  - **Quando usar:** Para testar a API real e para apresentar ao professor. O que você inserir aqui cai no banco de dados da internet e aparece imediatamente no celular de quem tiver o aplicativo. Esse link é público, qualquer um pode ver (mas precisa do login para usar as rotas restritas).

### 2. O Banco de Dados (Os Dois Prismas)
Existem dois bancos de dados completamente isolados. Como ver cada um com a interface bonita do "Prisma Studio"? A mágica está no arquivo `backend-app/.env`.

- 🏠 **Ver o Banco Local (Postgres no seu PC):**
  - **Passo 1:** Garanta que a variável `DATABASE_URL` no seu `.env` esteja com a URL de `localhost`.
  - **Passo 2:** Rode o comando `npx prisma studio` no terminal da pasta do backend.
  - **Link:** O navegador vai abrir sozinho em [http://localhost:5555](http://localhost:5555).

- ☁️ **Ver o Banco da Nuvem (Supabase Oficial):**
  - **A Opção Oficial (Pelo Site):**
    - Acesse [https://supabase.com/](https://supabase.com/), faça login, entre no seu projeto e clique em **Table Editor** no menu esquerdo. Lá você vê as tabelas exatamente como no Prisma Studio.
  - **A Opção do Prisma Studio (Truque Avançado):**
    - **Passo 1:** Troque a variável `DATABASE_URL` no seu `.env` temporariamente para a URL do Supabase (aquela gigantesca).
    - **Passo 2:** Rode o comando `npx prisma studio`.
    - **Link:** [http://localhost:5555](http://localhost:5555) (Sim, é a mesma porta, mas dessa vez as tabelas que vão aparecer são as da Nuvem!). *Aviso: Lembre-se de voltar a URL para localhost depois!*

### 3. Visualizando a Infraestrutura (Os Painéis da Nuvem)
Se o professor perguntar: *"Onde seu Backend está hospedado fisicamente e como vejo ele funcionando?"*
- **O Backend (Render):** Acesse [https://dashboard.render.com/](https://dashboard.render.com/). Faça login e você verá a sua API listada com uma luz verde de `Deploy`. Clicando nela, há a aba `Logs` onde você pode ver o terminal da nuvem em tempo real! Toda vez que alguém abrir o app, os logs aparecerão ali.

### 4. Comandos Essenciais para Atualizar o Aplicativo
Sempre execute estes comandos no terminal **dentro da pasta `frontend-app`**:

- 📦 **Para gerar um NOVO arquivo `.apk` (Versão definitiva para Android):**
  - **Quando usar:** Se você alterou códigos das telas, imagens, caminhos, e quer que a professora ou usuários baixem o aplicativo com a nova "cara" e novas funções visuais.
  - **Comando:** `eas build -p android --profile preview`
  - **Onde ver:** O terminal vai gerar um link. Clique nele para abrir o site do Expo, ver a barrinha de progresso e baixar o APK no final.

- 📱 **Para atualizar quem usa via Expo Go (A Atualização Invisível/QR Code):**
  - **Quando usar:** Quando você quiser atualizar as telas para quem usa o iPhone ou que não instalou o APK. Eles não precisam escanear o QR Code de novo!
  - **Comando:** `eas update --branch preview --message "Descreva o que mudou aqui"`
  - **Onde ver:** O terminal gera a URL do painel. Mas o principal é que, após o comando terminar, a pessoa só precisa fechar e abrir o Expo Go no celular dela que a tela nova já aparece.
