# Command: Dynamic Voice Title

## Description
Updates the title/type of a dynamic voice channel.

## Trigger
`/voice-titulo` (Inferred from `DYNAMIC_VOICE_TITLE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "Presented" role).
- **Options:**
  - `tipo` (Integer, Required): New type.
  - `estudando-titulo` (Integer, Optional): New study topic.
- **Flow:**
  1. Validates user is "Presented".
  2. Validates user is in a dynamic voice channel.
  3. **Ownership Check:** Verifies ownership via control embed.
  4. Updates channel name.
  5. Replies with success.

## Migration Plan
- **Logic:** Relies on control embed for ownership check.
