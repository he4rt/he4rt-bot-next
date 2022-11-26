# He4rt Discord Bot Contributing Guide

### Requirements

- [GIT](https://git-scm.com/)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Node 16](https://nodejs.org/en/)
- [PNPM](https://pnpm.io/pt/)

### Run

```bash
pnpm install

pnpm dev
// OR
pnpm production
```

### Tests

```bash
pnpm test       // run with coverage
pnpm test:dev   // run with watcher
pnpm test:ui    /  run with ui
```

### Deploy

```bash
// set version, set git tag, generate changelog and push
pnpm version:(patch|minor|major)
```

## Commit Guideline

No geral, serão considerados válidos os commits que seguem a base do [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

## Pull Request Guideline

No geral, serão considerados válidos PR's detalhados e de fácil compreensão.