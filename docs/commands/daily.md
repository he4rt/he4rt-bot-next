# Command: Daily

## Description
Allows users to redeem their daily H-Coins reward.

## Trigger
`/daily` (Inferred from `DAILY.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** None (Public, but checks for "Presented" role).
- **Options:** None
- **Flow:**
  1. Checks if the user has the "Presented" role.
  2. Checks the cooldown (24 hours) using Firebase data.
  3. If on cooldown, replies with error.
  4. Calls internal API (`client.api.he4rt.users.daily().post()`) to register the transaction.
  5. Updates user data in Firebase (increment streak, set last redeem time).
  6. Replies with success.

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Database:** Firebase integration.
- **Logic:** Cooldown logic and streak tracking need to be preserved.
