# Command: Stage Start

## Description
Starts a stage meeting.

## Trigger
`/iniciar-reuniao` (Inferred from `STAGE_START.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** `Administrator`
- **Options:**
  - `reuniao` (Integer, Required): Meeting Type (1: Weekly, 2: Primas).
- **Flow:**
  1. Calls internal API (`client.api.he4rt.events.discord.meeting.start.post`).
  2. Logs action.
  3. Replies with meeting ID.

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Logic:** API wrapper.
