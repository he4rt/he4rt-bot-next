# Command: Role Delete

## Description
Deletes a role from the server.

## Trigger
`/deletar-cargo` (Inferred from `ROLE_DELETE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `Administrator`
- **Options:**
  - `cargo` (Role, Required): Role to delete.
- **Flow:**
  1. Deletes the specified role.
  2. Logs action.
  3. Replies with success.

## Migration Plan
- **Logic:** Standard Role API usage.
