# Command: Watch Remove

## Description
Removes a user from the watch list.

## Trigger
`/remover-observado` (Inferred from `WATCH_REMOVE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `BanMembers`
- **Options:**
  - `membro` (User, Required): Target user.
- **Flow:**
  1. Calls `removeWatchedUser` (Firebase).
  2. Replies with success.

## Migration Plan
- **Database:** Firebase integration.
- **Logic:** Simple deletion.
