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
