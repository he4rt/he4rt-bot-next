# Command: Stage ATA

## Description
Submits the minutes (ATA) for a specific meeting.

## Trigger
`/ata` (Inferred from `STAGE_ATA.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public (checks for "ATA Member" - Scribe).
- **Options:**
  - `reuniao` (Integer, Required): Meeting ID.
  - `ata` (String, Required): Content of the minutes.
- **Flow:**
  1. Validates user is Scribe.
  2. Validates content length.
  3. Calls internal API (`client.api.he4rt.events.meeting(id).subject.patch`).
  4. Replies with success.

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Logic:** API wrapper.
