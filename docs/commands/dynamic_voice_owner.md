# Command: Dynamic Voice Owner

## Description
Transfers ownership of a dynamic voice channel to another user.

## Trigger
`/voice-dono` (Inferred from `DYNAMIC_VOICE_OWNER.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "Presented" role).
- **Options:**
  - `usuario` (User, Required): New owner.
- **Flow:**
  1. Validates both users are "Presented".
  2. Validates both users are in the same channel.
  3. Validates channel is a dynamic voice channel.
  4. **Ownership Check:** Fetches the first message in the channel (the control embed) and checks if the `author_id` field matches the command executor.
  5. Updates the control embed with the new owner's ID.
  6. Replies with success.

## Migration Plan
- **Logic:** Heavily relies on the "control embed" pattern (fetching first message, parsing fields). This is fragile and should be robustly migrated or refactored (e.g., using channel topic or database to store owner).
