# Command: Forum Create

## Description
Creates a new thread in the help forum.

## Trigger
`/abrir-topico` (Inferred from `FORUM_OPEN.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public
- **Options:**
  - `titulo` (String, Required): Thread title.
  - `descricao` (String, Required): Initial message content.
- **Flow:**
  1. Creates thread in Forum Channel.
  2. Name: `Username » Title`.
  3. Applied Tag: `UNSOLVED_TAG`.
  4. Logs action.
  5. Replies with success.

## Migration Plan
- **Configuration:** `UNSOLVED_TAG` ID.
- **Logic:** Standard Forum/Thread API usage.
