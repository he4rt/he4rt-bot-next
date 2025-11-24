# Command: Version

## Description
Displays the current bot version and websocket ping.

## Trigger
`/version` (Inferred from `VERSION.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `Administrator`
- **Flow:**
  1. Fetches version from `package.json` (via `getBotVersion`).
  2. Fetches ping from `client.ws.ping`.
  3. Replies with info (Ephemeral).

## Migration Plan
- **Logic:** Simple info command.
