# Command: Unban

## Description
Revokes a ban from a user.

## Trigger
`/unban` (Inferred from `UNBAN.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `BanMembers`
- **Options:**
  - `membro` (User, Required): User to unban (ID).
  - `razao` (String, Required): Reason.
  - `expor` (Channel, Optional): Channel to announce the unban.
- **Flow:**
  1. Executes `guild.members.unban()`.
  2. Creates an embed with details.
  3. Sends embed to `PUNISHMENTS_CHANNEL`.
  4. Optionally sends to `expor` channel.
  5. Replies with success.

## Migration Plan
- **Permissions:** Ensure bot has `BanMembers`.
- **Logic:** Standard Discord Unban API usage.
