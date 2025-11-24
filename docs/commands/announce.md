# Command: Announce

## Description
Sends an announcement to the designated adverts channel. This command is restricted to administrators.

## Trigger
`/anunciar` (Inferred from `ANNOUNCE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `Administrator`
- **Options:**
  - `texto` (String, Required): The content of the announcement.
- **Flow:**
  1. Retrieves the `texto` option.
  2. Fetches the `ADVERTS_CHANNEL`.
  3. Sends the message to the channel prefixed with `EMBED_CONTENT`.
  4. Replies to the interaction with a success message.

## Migration Plan
- Ensure the new system supports slash commands with permission checks.
- Verify the `ADVERTS_CHANNEL` ID is configurable or migrated.
- Re-implement the logic to send messages to a specific channel.
