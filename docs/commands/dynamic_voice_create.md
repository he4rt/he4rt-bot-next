# Command: Dynamic Voice Create

## Description
Creates a temporary dynamic voice channel for the user.

## Trigger
`/criar-voice` (Inferred from `DYNAMIC_VOICE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "Presented" role).
- **Options:**
  - `tipo` (Integer, Required): Channel type (Game, Study, etc.).
  - `limite` (Integer, Required): User limit.
  - `estudando-titulo` (Integer, Optional): Specific study topic.
- **Flow:**
  1. Validates user is "Presented".
  2. Checks if user is already in a dynamic voice channel (prevent spam).
  3. Creates a voice channel in `DYNAMIC_CATEGORY_CHANNEL`.
  4. Creates an invite code.
  5. Sends a control embed to the new channel (used for ownership tracking).
  6. Replies with the invite URL (Ephemeral).

## Migration Plan
- **Configuration:** `DYNAMIC_CATEGORY_CHANNEL` ID.
- **Logic:** The "control embed" pattern is crucial for other dynamic voice commands (`owner`, `size`, `title`) to work, as they parse this message to verify ownership.
