# Command: Ask

## Description
Provides guidelines on how to ask questions effectively ("Don't ask to ask"), directing the advice to a specific member.

## Trigger
`/ask` (Inferred from `ASK.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** None (Public)
- **Options:**
  - `membro` (User, Required): The user to whom the advice is directed.
- **Flow:**
  1. Retrieves the target member.
  2. Constructs an embed with:
     - Title: `EMBED_TITLE`
     - Description: Guidelines (Explain idea, show attempts, show errors).
     - Image: `EMBED_IMAGE_URL`
  3. Sends the embed to the channel, pinging the target user.
  4. Replies to the interaction with success.

## Migration Plan
- **Assets:** Ensure `EMBED_IMAGE_URL` is available.
- **Logic:** Simple embed generation and sending. Easy to migrate.
