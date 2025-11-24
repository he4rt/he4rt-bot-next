# Command: Timeout

## Description
Times out (mutes) a user for a specified duration.

## Trigger
`/timeout` (Inferred from `COMMANDS.TIMEOUT.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `MuteMembers`
- **Options:**
  - `membro` (User, Required): Target user.
  - `razao` (String, Required): Reason.
  - `tempo` (Number, Required): Duration in milliseconds (Choices: 60s, 5m, 10m, 1h, 1d, 1w).
- **Flow:**
  1. Executes `member.timeout()`.
  2. Creates an embed with details.
  3. Sends embed to `PUNISHMENTS_CHANNEL`.
  4. DMs the user with the reason.
  5. Replies with success.

## Migration Plan
- **Permissions:** Ensure bot has `ModerateMembers` (Timeout) permission.
- **Logic:** Standard Discord Timeout API usage.
