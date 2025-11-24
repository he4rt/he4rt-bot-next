# Command: Forum Close

## Description
Marks a forum thread as solved and closes it.

## Trigger
`/fechar-topico` (Inferred from `FORUM_CLOSE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public
- **Flow:**
  1. Checks if current channel is a thread.
  2. Edits thread:
     - `archived`: true
     - `locked`: true
     - `appliedTags`: Adds `SOLVED_TAG`.
  3. Logs action.
  4. Replies with success.

## Migration Plan
- **Configuration:** `SOLVED_TAG` ID.
- **Logic:** Standard Thread API usage.
