# Command: Watch List

## Description
Lists all users currently being watched.

## Trigger
`/lista-observados` (Inferred from `WATCH_LIST.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `BanMembers`
- **Flow:**
  1. Calls `getWatchedUsers` (Firebase).
  2. Formats and sends list (Ephemeral).

## Migration Plan
- **Database:** Firebase integration.
- **Logic:** Simple list retrieval.
