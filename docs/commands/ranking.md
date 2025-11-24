# Command: Ranking

## Description
Displays the server leaderboard based on experience/level.

## Trigger
`/ranking` (Inferred from `RANKING.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "Presented" role).
- **Options:**
  - `pagina` (Number, Required): Page number to view.
- **Flow:**
  1. Checks if user is "Presented".
  2. Calls internal API (`client.api.he4rt.ranking.leveling.get`) with page number.
  3. Iterates results and builds an embed with fields for each user.
  4. Replies with the embed (Ephemeral).

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Logic:** Pagination logic depends on API response.
