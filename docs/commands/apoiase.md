# Command: Apoiase

## Description
Links a user's Discord account with their Apoia.se account to grant donator perks.

## Trigger
`/apoiase` (Inferred from `APOIASE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** None (Public, but checks for "Presented" role internally)
- **Options:**
  - `email` (String, Required): The email address used on Apoia.se.
- **Flow:**
  1. Validates if the user has the "Presented" role (`isPresentedMember`).
  2. Validates the email format using Regex.
  3. Calls the external Apoia.se API (`client.api.apoiase.backers.charges(email).get()`).
  4. Checks if:
     - User is a backer (`isBacker`).
     - Payment was made this month (`isPaidThisMonth`).
     - Payment value meets the minimum (`thisMonthPaidValue >= APOIASE_CUSTOM_COLOR_MINIMAL_VALUE`).
  5. If valid:
     - Upserts user data to Firebase (`upsertUser`).
     - Adds `DONATOR_ROLE` to the user.
     - Sends a celebration message in `CHAT_CHANNEL`.
     - Logs the success.
  6. If invalid or API fails, logs the error and notifies the user.

## Migration Plan
- **External Dependency:** Requires Apoia.se API integration.
- **Database:** Requires Firebase integration (or equivalent in new system).
- **Configuration:** Needs `DONATOR_ROLE`, `CHAT_CHANNEL`, and `APOIASE_CUSTOM_COLOR_MINIMAL_VALUE`.
- **Logic:** Re-implement the API call and validation logic.
