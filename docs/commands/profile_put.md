# Command: Profile Put

## Description
Updates the user's profile information.

## Trigger
`/atualizar-perfil` (Inferred from `PROFILE_PUT.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "Presented" role).
- **Options:**
  - `nome` (String, Optional)
  - `nick` (String, Optional)
  - `sobre` (String, Optional)
  - `git` (String, Optional)
  - `linkedin` (String, Optional)
- **Flow:**
  1. Validates user is "Presented".
  2. Constructs the update payload from provided options.
  3. Calls internal API (`client.api.he4rt.users.profile(id).put`).
  4. Replies with success.

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Logic:** API wrapper.
