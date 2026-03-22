## LoL Skins Tracker

Aplicação web para controlar quais campeões de League of Legends você já possui alguma skin, usando autenticação do Google (Firebase Auth) e armazenamento no Firestore. Os dados de campeões são carregados diretamente da API pública Data Dragon da Riot.

### Funcionalidades

- Login com Google.
- Lista de todos os campeões do LoL com imagem oficial.
- Marcar/desmarcar campeões que você possui alguma skin.
- Barra de progresso mostrando porcentagem de campeões com skins.
- Filtro por nome do campeão.
- Filtro por rota (Top, Mid, Bot, Support).
- Filtro por status de skin (todos, com skin, sem skin).

### Stack utilizada

- React + Vite
- Firebase Authentication (login com Google)
- Firebase Firestore (persistência dos campeões com skin)
- Riot Data Dragon (lista de campeões e imagens)
- ESLint com configuração Flat para boas práticas

### Pré-requisitos

- Node.js (recomendado >= 18)
- NPM ou outro gerenciador de pacotes compatível (npm, pnpm, yarn)
- Projeto Firebase configurado com Authentication (Google) e Firestore

A configuração do Firebase é feita em [src/firebase.js](src/firebase.js). Para uso em produção, o ideal é mover essas credenciais para variáveis de ambiente e não commitar chaves sensíveis.

### Como rodar o projeto

Instale as dependências:

```bash
npm install
```

Suba o servidor de desenvolvimento:

```bash
npm run dev
```

Build para produção:

```bash
npm run build
```

Pré-visualizar o build de produção:

```bash
npm run preview
```

Rodar lint:

```bash
npm run lint
```

### Estrutura e organização do código

- public/ – arquivos públicos estáticos.
- src/
	- main.jsx – ponto de entrada React, renderiza o App.
	- App.jsx – componente container, responsável por:
		- Observar autenticação do Firebase.
		- Carregar e salvar campeões no Firestore.
		- Buscar lista de campeões na API Data Dragon.
		- Controlar filtros (busca, rota, status de skin).
		- Decidir se mostra a tela de login (Login) ou a home (Home).
	- firebase.js – inicialização do Firebase (Auth + Firestore).
	- index.css – estilos globais (tema, grid, cards, header, filtros).
	- components/
		- Login.jsx – componente de tela de login, botão "Entrar com Google".
		- Home.jsx – tela principal logada, header com progresso, nome/foto do usuário, filtros e grid de campeões.

### Melhorias futuras (ideias)

- Diferenciar se o usuário tem mais de uma skin por campeão.
- Adicionar mais filtros (linha/jungle detalhado, função, raridade de skin, etc.).
- Suporte a temas (dark/light) customizáveis.
- Internacionalização (pt-BR/en-US).

### Aviso

Este projeto é de uso pessoal/educacional e não é afiliado à Riot Games. Todos os direitos sobre imagens, campeões e marcas são da Riot Games.
