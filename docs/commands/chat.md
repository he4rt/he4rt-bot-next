# Command: Chat

## Description
Locks or unlocks a text channel by modifying permissions for `@everyone` and the "Presented" role.

## Trigger
`/chat` (Inferred from `COMMANDS.CHAT.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `ManageMessages`
- **Options:**
  - `canal` (Channel, Required): The channel to modify.
  - `parar` (Boolean, Required): `true` to lock (stop chat), `false` to unlock.
- **Flow:**
  1. Retrieves the target channel and the boolean value.
  2. Updates `SendMessages` permission for the guild ID (effectively `@everyone`) to the boolean value.
  3. Updates `SendMessages` permission for `PRESENTED_ROLE` to the boolean value.
  4. Replies with success or error.

## Migration Plan
- **Permissions:** Bot needs `ManageChannels` or `ManageRoles` to edit channel overrides.
- **Configuration:** `PRESENTED_ROLE` ID.
- **Logic:** Ensure the logic correctly handles both role and everyone overrides to effectively lock/unlock.
