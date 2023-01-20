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
- `/falar` (ADM)
- `/cargo-criar` (ADM)
- `/cargo-deletar` (ADM)
- `/versao` (ADM)
- `/banir` (ADM|MOD)
- `/desbanir` (ADM|MOD)
- `/silenciar` (ADM|MOD)
- `/chat` (ADM|MOD)
- `/limpar` (ADM|MOD)
- `/cor` (PRIVILEGIADOS)
- `/reputacao` (DESATIVADO)
- `/especial`
- `/sala`
- `/avaliar`
- `/apoiase`
- `/bonus`
- `/apresentar`
- `/perfil`
- `/perfil-editar`
- `/perguntar`
- `/ranqueamento`
- `/distintivo`
- `/distintivo-criar` (ADM)
- `/codigo`
- `/forum`
- `/forum-fechar`
- `/reuniao-iniciar` (ADM)
- `/reuniao-finalizar` (ADM)
- `/reuniao-ata` (ESCRIVÃO)
- `/onboarding`
- `/onboarding-requisitar`
- `/onboarding-voluntariar`
- `/onboarding-finalizar`
- `/onboarding-desistir`

## Differences to [v1](https://github.com/he4rt/He4rt-Bot)

- `JS` -> `TS 100% Type-Safe`;
- `discord.js v9` -> `discord.js v14`;
- Versionamento com `git tags`;
- Deploy automático;
- Fluxo de código [Orientado a Dados (OOD)](https://en.wikipedia.org/wiki/Data-oriented_design);
- _Purge_ completo de bibliotecas desnecessárias/depreciadas;
- Implementação de _Logger_ para o registro de todas as ações;
- Implementação de _Jobs_ para eventos temporizados;
- Implementação de _Ticker_ para eventos sequenciais;
- Integração com o [apoia.se](https://apoia.se/heartdevs);
- _Gamificação_ com as interações do usuário no servidor;
- Sistema para gerenciamento das reuniões semanais;
- Sistema de acolhimento à novos membros pelo método _onboarding_;
- Aplicação de canal de voz dinâmico pelo comando `/sala`;
- Aplicação do [Pomodoro](https://pt.wikipedia.org/wiki/T%C3%A9cnica_pomodoro) no canal de voz _Coworking_;
- Agora os comandos podem ser utilizados em qualquer canal (comandos privilegiados ainda dependem de condições de canal específico, como o /cor);
- A grande maioria dos comandos retornam mensagens visíveis somente para o usuário com o intuito de não poluir os canais (e permitir a abordagem do item anterior);
- Lista de comandos integrada com o `/` do próprio discord;
- Agora os comandos usam a implementação de argumentos do `discord.js`;
- `Nitro Boosters` agora possuem acesso ao canal de apoiadores e seus benefícios (/cor, por exemplo), deixando a role `Apoiadores` somente para os membros apoiadores;
- Controle de cargos, canais, palcos e forums;
- `/apresentar` somente por texto, descartando as reações;
- `/apresentar` com recursos adicionais para o `He4rt Delas`;
- Todas as definições estão na pasta `src/defines` ao invés de usar o `.env`;
- Os eventos do discord estão subdivididos pelo seu emissor (a versão antiga tratava somente em eventos de mensagem).

## Development

Caso deseje contribuir ao projeto, leia o [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) e o [CONTRIBUTING.md](./CONTRIBUTING.md).

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
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/fernanduandrade>
            <img src=https://avatars.githubusercontent.com/u/58053397?v=4 width="100;"  alt=Fernando Andrade/>
            <br />
            <sub style="font-size:14px"><b>Fernando Andrade</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/P0sseid0n>
            <img src=https://avatars.githubusercontent.com/u/54502007?v=4 width="100;"  alt=Matheus/>
            <br />
            <sub style="font-size:14px"><b>Matheus</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/DanielHe4rt>
            <img src=https://avatars.githubusercontent.com/u/6912596?v=4 width="100;"  alt=Daniel Reis/>
            <br />
            <sub style="font-size:14px"><b>Daniel Reis</b></sub>
        </a>
    </td>
</tr>
</table>

A He4rt Developers agradece a todos os contribuidores acima e aos contribuidores [da primeira versão](https://github.com/he4rt/He4rt-Bot/blob/master/README.md#-contribuidores)!
