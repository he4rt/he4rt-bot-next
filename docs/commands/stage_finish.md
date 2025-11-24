# Command: Stage Finish

## Description
Ends a stage meeting.

## Trigger
`/finalizar-reuniao` (Inferred from `STAGE_FINISH.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `Administrator`
- **Flow:**
  1. Calls internal API (`client.api.he4rt.events.discord.meeting.end.post`).
  2. Replies with API message.

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Logic:** API wrapper.
