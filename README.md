# He4rt Discord-Bot NEXT

**Differences to the OLD Version:**

- `JS` -> `TS 100% Type-Safe`
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

## Requirements

- [Node 14](https://nodejs.org/en/)
- [PNPM](https://pnpm.io/pt/)

## Run

```bash
pnpm install

pnpm dev
// OR
pnpm production
```

## Documentation

No código 🏄