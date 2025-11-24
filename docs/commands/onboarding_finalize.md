# Command: Onboarding Finalize

## Description
Marks an onboarding session as finished and announces it.

## Trigger
`/onboarding-finalizar` (Inferred from `ONBOARDING_FINALIZE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "Volunteer" role).
- **Options:**
  - `membro` (User, Required): The user who was helped.
- **Flow:**
  1. Validates executor is a Volunteer.
  2. Sends a celebration message to `CHAT_CHANNEL`.
  3. Replies with success.

## Migration Plan
- **Configuration:** `CHAT_CHANNEL` ID.
- **Logic:** Simple message sending.
