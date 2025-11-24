# Command: Dynamic Voice Size

## Description
Updates the user limit of a dynamic voice channel.

## Trigger
`/voice-limite` (Inferred from `DYNAMIC_VOICE_SIZE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "Presented" role).
- **Options:**
  - `limite` (Integer, Required): New limit.
- **Flow:**
  1. Validates user is "Presented".
  2. Validates user is in a dynamic voice channel.
  3. **Ownership Check:** Verifies ownership via control embed.
  4. Updates channel `userLimit`.
  5. Replies with success.

## Migration Plan
- **Logic:** Relies on control embed for ownership check.
