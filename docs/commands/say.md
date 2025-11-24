# Command: Say

## Description
Sends a message to a specific channel as the bot.

## Trigger
`/falar` (Inferred from `SAY.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `Administrator`.
- **Options:**
  - `canal` (Channel, Required): Target channel.
  - `mensagem` (String, Required): Message content.
- **Flow:**
  1. Retrieves channel and message.
  2. Sends message to channel.
  3. Replies with success.

## Migration Plan
- **Permissions:** Ensure `Administrator` restriction.
- **Logic:** Simple send message logic.
