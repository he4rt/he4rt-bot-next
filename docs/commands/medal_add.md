# Command: Medal Add

## Description
Adds a medal (role) to a user, optionally with an expiration time.

## Trigger
`/adicionar-medalha` (Inferred from `MEDAL_ADD.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `Administrator`
- **Options:**
  - `membro` (User, Required): Target user.
  - `medalha` (Role, Required): Medal role.
  - `tempo` (Number, Optional): Expiration time in days.
- **Flow:**
  1. Calculates expiration timestamp if time is provided.
  2. Calls `addUserInMedal` (Firebase) to store the medal assignment.
  3. Replies with success.

## Migration Plan
- **Database:** Firebase integration.
- **Logic:** Expiration logic needs to be handled by a separate cron/ticker (likely `ticker/medals.ts`).
