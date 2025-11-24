# Command: Ban

## Description
Bans a user from the server, logs the action, and optionally exposes the ban in a public channel.

## Trigger
`/ban` (Inferred from `BAN.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `BanMembers`
- **Options:**
  - `membro` (User, Required): The user to ban.
  - `razao` (String, Required): The reason for the ban.
  - `expor` (Channel, Optional): A channel to post the ban notice publicly.
- **Flow:**
  1. DMs the target user with the ban reason.
  2. Executes the ban (`guild.members.ban`) with 7 days of message deletion.
  3. On success:
     - Creates an embed with ban details.
     - Sends the embed to `PUNISHMENTS_CHANNEL`.
     - If `expor` channel is provided, sends the embed there and reacts with emojis.
     - Replies to the interaction with success.
  4. On failure, replies with an error.

## Migration Plan
- **Permissions:** Ensure the bot has ban permissions.
- **Configuration:** `PUNISHMENTS_CHANNEL` ID.
- **Logic:** Re-implement ban logic, DMing user before banning is a common pattern to preserve.
