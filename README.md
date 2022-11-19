<p align="center">
  <a href="https://discord.gg/he4rt">
    <img src="./.github/logo.png" height="220">
  </a>
</p>

<h1 align="center">
He4rt Discord Bot
</h1>
<p align="center">
  <a href="https://discord.gg/he4rt"><img src="https://img.shields.io/github/package-json/v/he4rt/he4rt-bot-next?color=782BF1&style=for-the-badge"></a>
  <a href="https://discord.gg/he4rt"><img src="https://img.shields.io/github/license/he4rt/he4rt-bot-next?color=A655FF&style=for-the-badge"></a>
<p>

## Commands

- `/anunciar` (ADM)
- `/ban` (ADM|MOD)
- `/unban` (ADM|MOD)
- `/timeout` (ADM|MOD)
- `/chat` (ADM|MOD)
- `/cor` (PRIVILEGIADOS)
- `/daily`
- `/apresentar`
- `/perfil`
- `/ranking`

## Development

### Requirements

- [Node 14](https://nodejs.org/en/)
- [PNPM](https://pnpm.io/pt/)

### Run

```bash
pnpm install

pnpm dev
// OR
pnpm production
```


## Differences to [v1](https://github.com/he4rt/He4rt-Bot)

- `JS` -> `TS 100% Type-Safe`;
- `discord.js v9` -> `discord.js v14`;
- Fluxo implementado em [OOD](https://en.wikipedia.org/wiki/Object-oriented_design) (com limitações);
- *Purge* completo de lib's desnecessárias/depreciadas;
- Agora os comandos podem ser utilizados em qualquer canal (comandos privilegiados ainda dependem de condições de canal específico, como o /cor);
- A grande maioria dos comandos retornam mensagens visíveis somente para o usuário, com o intuito de não poluir os canais (e permitir a abordagem do item anterior);
- Lista de comandos integrada com o `/` do próprio discord;
- Agora os comandos usam a implementação de args nativa do `discord.js`;
- `Nitro Boosters` agora possuem acesso ao canal de apoiadores e seus benefícios (/cor, por exemplo), deixando a role `Apoiadores` somente para os membros do `apoia.se`
- Os usuários agora só são salvos na nuvem caso concluem o `/apresentar`, diferente de antes que o usuário precisava apenas entrar no servidor;
- `/apresentar` somente por texto, descartando as reações;
- `/apresentar` com recursos adicionais para o `He4rt Delas`;
- Todas as definições estão na pasta `src/defines` (com exceção das strings de localização) ao invés de usar o `.env`;
- Os listeners são subdivididos pelo seu emissor (a versão antiga tratava somente em eventos de mensagem).