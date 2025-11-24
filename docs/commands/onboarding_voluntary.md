# Command: Onboarding Voluntary

## Description
Registers a user as a volunteer.

## Trigger
`/onboarding-voluntariar` (Inferred from `ONBOARDING_VOLUNTARY.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "Presented" role).
- **Flow:**
  1. Validates user is "Presented".
  2. Checks if already a volunteer.
  3. Adds `VOLUNTEER_ROLE`.
  4. Logs action.
  5. Replies with success and instructions.

## Migration Plan
- **Configuration:** `VOLUNTEER_ROLE` ID.
- **Logic:** Role management.
