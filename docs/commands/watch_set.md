# Command: Watch Set

## Description
Adds a user to the watch list.

## Trigger
`/observar` (Inferred from `WATCH.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `BanMembers`
- **Options:**
  - `membro` (User, Required): Target user.
  - `razao` (String, Required): Reason.
- **Flow:**
  1. Calls `insertWatchedUser` (Firebase).
  2. Replies with success.

## Migration Plan
- **Database:** Firebase integration.
- **Logic:** Simple insertion.
