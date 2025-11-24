# Command: Clear

## Description
Bulk deletes a specified number of messages from the current channel.

## Trigger
`/limpar` (Inferred from `CLEAR.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `ManageMessages`
- **Options:**
  - `quantidade` (Number, Required): The number of messages to delete.
- **Flow:**
  1. Retrieves the `quantidade` option.
  2. Fetches the last N messages in the channel.
  3. Iterates and deletes each message.
  4. Replies with success.

## Migration Plan
- **Permissions:** Ensure bot has `ManageMessages`.
- **Logic:** Use `channel.bulkDelete` if possible for efficiency, instead of iterating.
