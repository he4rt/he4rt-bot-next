# He4rt Discord Bot Contributing Guide

### Requirements

- [Discord Development Portal](https://discord.com/developers/docs/intro)
- [Discord Permissions](https://discordapi.com/permissions.html)
- [discord.js Guide](https://discordjs.guide/#before-you-begin)
- [discord.js Docs](https://discord.js.org/)
- [GIT](https://git-scm.com/)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Node 16.18.1](https://nodejs.org/en/)
- [PNPM](https://pnpm.io/pt/)

> ATENÇÃO! Siga os guias do portal do desenvolver e convide o bot para o seu servidor usando o Discord Permissions para facilitar o seu trabalho.

### Run

```
cp .env.example .env
```

> Itens com o prefixo `HE4RT_` indicam env do [discord-bot-api](https://github.com/he4rt/he4rt-bot-api), `FIREBASE_` do... firebase, `APOIASE_` do [apoia.se](https://github.com/he4rt/he4rt-bot-api). Essencialmente, você >não< precisa desses tokens para rodar o bot, apenas para testar comandos que dependem destas chaves.

> Caso queira usar o firebase, crie o seu json de admin na raiz do projeto com o nome `firebase_admin.json`

```bash
pnpm install

pnpm dev
// OR
pnpm production
```

> ATENÇÃO! Caso use o comando `pnpm dev` e dê algum erro, aperte `Ctrl + S` em um arquivo `.ts` para ele recompilar a aplicação.

### Commit Guideline

No geral, serão considerados válidos os commits que seguem a base do [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

### Pull Request Guideline

No geral, serão considerados válidos PR's detalhados e de fácil compreensão.

### Structure

```
.
├── client                       # Anexos para o cliente padrão do `discord.js`
├── commands                     # Comandos do BOT
├── defines                      # Definições
├── events                       # Eventos temporizados, sequenciais e do discord.js
├── http                         # Construtores HTTP
| global.d.ts                    # Tipos do NodeJS e derivados
| index.ts                       # Ponto de partida para a inicialização do BOT
| main.ts                        # Criação do cliente do `discord.js`
| types.ts                       # Tipagem
| utils.ts                       # Funções para uso genérico em outros arquivos
```
