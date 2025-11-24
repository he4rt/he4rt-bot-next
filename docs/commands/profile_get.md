# Command: Profile Get

## Description
Displays a user's profile card.

## Trigger
`/perfil` (Inferred from `PROFILE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "Presented" role).
- **Options:**
  - `membro` (User, Optional): Target user. Defaults to executor.
- **Flow:**
  1. Validates user is "Presented".
  2. Calls internal API (`client.api.he4rt.users.profile(id).get`).
  3. Constructs an embed with:
     - Profile Link
     - Name, Nickname, State
     - About, Git, LinkedIn
     - Level, XP
     - Languages (Roles), English Level (Role), Special Roles
  4. Replies with the embed (Ephemeral).

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Logic:** Complex embed construction based on API data and Discord roles.
