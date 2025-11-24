# Command: Color

## Description
Allows boosters and patrons to create or update a custom colored role for themselves.

## Trigger
`/cor` (Inferred from `COLOR.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Restricted to "Privileged" members (Boosters/Patrons).
- **Options:**
  - `hex` (String, Required): The hex color code (e.g., `#FF0000`).
- **Flow:**
  1. Checks if the user is privileged.
  2. Checks if the command is used in `DONATORS_CHANNEL`.
  3. Validates the hex color format.
  4. Checks against restricted colors.
  5. Checks if the user already has a custom color role.
     - **If no:** Creates a new role with the user's tag, sets the color, assigns it to the user, and positions it above their highest role.
     - **If yes:** Updates the existing role's color and position.
  6. Logs the action.
  7. Replies with success.

## Migration Plan
- **Permissions:** Logic relies on `isPrivilegedMember` check.
- **Configuration:** `DONATORS_CHANNEL` ID, `RESTRICTED_CUSTOM_ROLE_COLORS`.
- **Logic:** Role management (create/edit/position) is complex and needs careful migration to avoid permission hierarchy issues.
