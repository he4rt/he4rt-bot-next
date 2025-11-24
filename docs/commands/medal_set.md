# Command: Medal Set

## Description
Allows a user to equip a specific medal they own.

## Trigger
`/medalha` (Inferred from `MEDAL.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public
- **Options:**
  - `medalha` (Role, Required): Medal to equip.
- **Flow:**
  1. Checks if user owns the medal (Firebase).
  2. Checks if user already has the role.
  3. Fetches all known medals (Firebase).
  4. Adds the selected medal role.
  5. Removes all other medal roles (Equip limit: 1).
  6. Replies with success.

## Migration Plan
- **Database:** Firebase integration.
- **Logic:** "Equip only one" logic is key here.
