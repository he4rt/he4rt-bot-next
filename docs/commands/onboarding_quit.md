# Command: Onboarding Quit

## Description
Allows a volunteer to resign from the program.

## Trigger
`/onboarding-desistir` (Inferred from `ONBOARDING_QUIT.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "Volunteer" role).
- **Flow:**
  1. Validates executor is a Volunteer.
  2. Removes `VOLUNTEER_ROLE`.
  3. Logs action.
  4. Replies with success.

## Migration Plan
- **Configuration:** `VOLUNTEER_ROLE` ID.
- **Logic:** Role management.
