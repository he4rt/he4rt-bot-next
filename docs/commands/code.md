# Command: Code

## Description
Displays a guide on how to properly format code blocks in Discord using markdown.

## Trigger
`/code` (Inferred from `CODE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** None (Public)
- **Options:** None
- **Flow:**
  1. Constructs a message showing how to use backticks for code blocks.
  2. Sends the guide to the channel.
  3. Replies with success.

## Migration Plan
- **Logic:** Simple static content response. Easy to migrate.
