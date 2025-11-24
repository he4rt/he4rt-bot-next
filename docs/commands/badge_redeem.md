# Command: Badge Redeem

## Description
Allows a user to redeem a badge using a specific code.

## Trigger
`/resgatar-conquista` (Inferred from `BADGE_SET.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public
- **Options:**
  - `codigo` (String, Required): The redemption code.
- **Flow:**
  1. Calls internal API (`client.api.he4rt.characters.discord(id).claimBadge.post`).
  2. Logs success.
  3. Replies with success or error (Ephemeral).

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Logic:** Simple API wrapper.
