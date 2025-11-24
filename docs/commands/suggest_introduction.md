# Command: Suggest Introduction

## Description
Suggests to a user that they should introduce themselves to gain access to the server. It sends a public message with a button to start the introduction flow.

## Trigger
`/sugerir-apresentacao` (Inferred from `SUGGEST_INTRODUCE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public
- **Options:**
  - `member` (User, Required): The user to suggest.
- **Flow:**
  1. Validates if target is already presented or currently presenting.
  2. Creates an embed with a call to action.
  3. Sends the embed with a "Present-se" button (`c-introduce`) to the channel.
  4. Replies with success.

## Migration Plan
- **Interactivity:** Uses the same `c-introduce` button ID as the main Introduction command.
- **Logic:** Simple validation and message sending.
