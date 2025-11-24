# Command: Introduction

## Description
Initiates the onboarding flow for new members. It collects user information via DM, assigns roles, and posts an introduction card to the presentations channel.

## Trigger
`/apresentar` (Inferred from `INTRODUCE.TITLE`) or Button `c-introduce`

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (DMPermission: true)
- **Flow:**
  1. **Trigger:** User uses command or clicks the "Present-se" button.
  2. **Validation:** Checks if user is already presented (`isPresentingMember`).
  3. **DM Flow:** Opens a DM with the user.
     - Collects: Name, Nickname, About, Github URL, LinkedIn URL.
     - Selects: State (UF) from a list.
     - Selects: Programming Languages (Roles).
     - Selects: English Level (Role).
     - Selects: He4rt Delas (Role, optional).
  4. **Completion:**
     - Generates an embed with collected info.
     - Sends embed to `PRESENTATIONS_CHANNEL`.
     - Reacts with He4rt or He4rt Delas emoji.
     - Adds `PRESENTED_ROLE` to user.
     - Removes `PRESENTING_ROLE`.
     - Updates sticky message in channel.
  5. **API Sync:**
     - Creates/Updates user in internal API (`client.api.he4rt`).
     - Logs success/failure.

## Migration Plan
- **Complexity:** High. This is a multi-step stateful flow.
- **State Management:** Currently uses `awaitMessages` in DM. Consider using Modals for better UX if possible, though the number of fields might exceed Modal limits.
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Configuration:** Multiple Role IDs, Channel IDs.
- **Logic:** The sticky message logic and the multi-step DM collection need to be carefully ported.
