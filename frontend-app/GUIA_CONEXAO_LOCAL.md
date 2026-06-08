# 🚀 Guia de Conexão: Rodando o Projeto em Qualquer Máquina

Este guia é o seu manual de sobrevivência para rodar o aplicativo **GRAL** (Frontend + Backend + Banco de Dados) em qualquer computador ou rede Wi-Fi nova (por exemplo, na faculdade, no trabalho ou em um novo PC).

Sempre que você mudar de ambiente, o endereço "local" do seu computador muda. Siga este roteiro para garantir que o celular consiga enxergar a API do seu computador.

---

## 📱 Parte 1: Como fazer o Celular achar o Backend (Mudança de Wi-Fi)

Se você já instalou tudo, mas mudou de Wi-Fi (ex: foi para a faculdade), o aplicativo no celular vai dar erro `Network request failed`. Siga estes passos:

### 1. Descubra o IP do seu Computador na rede atual
1. Abra o Terminal (`cmd` ou `powershell`) no Windows.
2. Digite o comando:
   ```bash
   ipconfig
   ```
3. Procure pela linha **Endereço IPv4** (Geralmente na seção de "Adaptador de Rede sem Fio Wi-Fi" ou "Ethernet").
   - Vai parecer com algo como: `192.168.0.5` ou `192.168.1.15`.

### 2. Atualize o Frontend
1. No seu projeto do frontend, abra o arquivo:
   > 👉 `frontend-app/src/services/api.ts`
2. Modifique a constante `BASE_URL` colocando o IP que você acabou de descobrir.
   ```typescript
   // Troque o número pelo seu IP atual. Mantenha o :3000/api/v1
   const BASE_URL = 'http://192.168.X.X:3000/api/v1'; 
   ```

### 3. Reinicie o Expo
Se o `npx expo start` já estava rodando, feche-o e rode de novo, ou simplesmente aperte a tecla `r` no terminal para dar reload no servidor.

> [!TIP]
> **Isso é tudo!** Se o backend e o banco já estiverem ligados, essa é a ÚNICA configuração que você precisa mudar ao trocar de rede Wi-Fi para testar no Expo Go.

---

## 💻 Parte 2: Rodando em um Computador Totalmente Novo

Se você clonar o projeto em uma **máquina virgem** (um computador que nunca rodou o projeto), você precisa fazer a infraestrutura nascer. Siga esta ordem:

### 1. O Banco de Dados (PostgreSQL)
1. Certifique-se de que o **PostgreSQL** está instalado na máquina.
2. Inicie o serviço do Postgres. O Prisma vai criar o banco automaticamente, mas o servidor do Postgres precisa estar de pé.

### 2. Subindo o Backend
1. Abra o terminal na pasta `backend-app`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. **Crie o arquivo `.env`**: Na raiz do `backend-app`, crie um arquivo `.env` (se não existir) com a URL de conexão do banco de dados da máquina nova:
   ```env
   DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/gralapp_db?schema=public"
   ```
4. Recrie as tabelas e as Seeds (o usuário Admin):
   ```bash
   npx prisma migrate reset
   npx prisma db seed
   ```
   *(Responda `y` quando perguntar)*
5. Ligue a API:
   ```bash
   npm run start:dev
   ```

### 3. Subindo o Frontend
1. Abra um segundo terminal na pasta `frontend-app`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Descubra o IP da máquina nova e altere no arquivo `api.ts` (conforme ensinado na **Parte 1**).
4. Rode o Expo:
   ```bash
   npx expo start
   ```

---

> [!IMPORTANT]
> Lembre-se: O backend responde na porta `:3000` (NestJS) e o frontend responde pela porta `:8081` (Expo). Sempre verifique se o seu celular e o computador estão na **mesma rede Wi-Fi**, caso contrário o celular nunca conseguirá "enxergar" o IP local da máquina!
