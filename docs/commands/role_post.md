# Command: Role Post

## Description
Creates a new role with a specified name and color.

## Trigger
`/criar-cargo` (Inferred from `ROLE_CREATE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `Administrator`
- **Options:**
  - `nome` (String, Required): Role name.
  - `hex` (String, Required): Hex color.
- **Flow:**
  1. Validates hex color.
  2. Creates role.
  3. Logs action.
  4. Replies with success.

## Migration Plan
- **Logic:** Standard Role API usage.
