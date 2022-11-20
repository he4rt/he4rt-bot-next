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
- `/banir` (ADM|MOD)
- `/desbanir` (ADM|MOD)
- `/suprimir` (ADM|MOD)
- `/chat` (ADM|MOD)
- `/falar` (ADM|MOD)
- `/cor` (PRIVILEGIADOS)
- `/bonus`
- `/apresentar`
- `/perfil`
- `/nivel`

## Development

### Requirements

- [GIT](https://git-scm.com/)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Node 14](https://nodejs.org/en/)
- [PNPM](https://pnpm.io/pt/)

### Run

```bash
pnpm install

pnpm dev
// OR
pnpm production
```

### Deploy

```bash
// set version, set git tag, generate changelog and push
pnpm version:(patch|minor|major)
```

## Differences to [v1](https://github.com/he4rt/He4rt-Bot)

- `JS` -> `TS 100% Type-Safe`;
- `discord.js v9` -> `discord.js v14`;
- Fluxo de código [Orientado a Dados (OOD)](https://en.wikipedia.org/wiki/Object-oriented_design);
- *Purge* completo de lib's desnecessárias/depreciadas;
- Agora os comandos podem ser utilizados em qualquer canal (comandos privilegiados ainda dependem de condições de canal específico, como o /cor);
- A grande maioria dos comandos retornam mensagens visíveis somente para o usuário com o intuito de não poluir os canais (e permitir a abordagem do item anterior);
- Lista de comandos integrada com o `/` do próprio discord;
- Agora os comandos usam a implementação de argumentos do `discord.js`;
- `Nitro Boosters` agora possuem acesso ao canal de apoiadores e seus benefícios (/cor, por exemplo), deixando a role `Apoiadores` somente para os membros do [apoia.se](https://apoia.se/heartdevs);
- Os usuários agora só são salvos na nuvem caso concluem o `/apresentar`, diferente de antes que o usuário precisava apenas entrar no servidor;
- `/apresentar` somente por texto, descartando as reações;
- `/apresentar` com recursos adicionais para o `He4rt Delas`;
- Todas as definições estão na pasta `src/defines` ao invés de usar o `.env`;
- Os listeners estão subdivididos pelo seu emissor (a versão antiga tratava somente em eventos de mensagem).

## Contributors

<table>
<tr>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/Novout>
            <img src=https://avatars.githubusercontent.com/u/41403842?v=4 width="100;"  alt=Giovane Cardoso/>
            <br />
            <sub style="font-size:14px"><b>Giovane Cardoso</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/kjkGustavo>
            <img src=https://avatars.githubusercontent.com/u/47262260?v=4 width="100;"  alt=Gustavo/>
            <br />
            <sub style="font-size:14px"><b>Gustavo</b></sub>
        </a>
    </td>
</tr>
</table>

A He4rt Developers agradece a todos os contribuidores acima e aos contribuidores [da primeira versão](https://github.com/he4rt/He4rt-Bot/blob/master/README.md#-contribuidores)!