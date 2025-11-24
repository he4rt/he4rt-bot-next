# Command: Reputation

## Description
Allows a user to give a reputation point to another user.

## Trigger
`/reputacao` (Inferred from `REPUTATION.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "Presented" role).
- **Options:**
  - `membro` (User, Required): Target user.
- **Flow:**
  1. Checks if author is "Presented".
  2. Calls internal API (`client.api.he4rt.users(id).reputation.post`) to give reputation.
  3. Replies with success or error.

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Logic:** Simple API wrapper.
