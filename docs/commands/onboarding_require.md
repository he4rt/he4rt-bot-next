# Command: Onboarding Require

## Description
Requests help from a volunteer.

## Trigger
`/onboarding-requisitar` (Inferred from `ONBOARDING_REQUIRE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public
- **Flow:**
  1. Sends a message to `VOLUNTEER_CHANNEL` pinging the Volunteer role.
  2. Replies with success.

## Migration Plan
- **Configuration:** `VOLUNTEER_CHANNEL` ID, `VOLUNTEER_ROLE` ID.
- **Logic:** Simple message sending.
