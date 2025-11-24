# Command: Judge

## Description
Allows users to submit feedback (praise or constructive criticism) about other members. Staff reviews and approves/denies the feedback.

## Trigger
`/avaliar` (Inferred from `JUDGE.TITLE`)

## DSL/Logic
- **Builder:** `SlashCommandBuilder`
- **Permissions:** Public
- **Options:**
  - `membro` (User, Required): Target user.
  - `tipo` (Integer, Required): 0 for Praise, 1 for Improvement.
  - `motivo` (String, Required): The feedback message.
- **Flow:**
  1. Validates message length.
  2. Creates an embed with the feedback.
  3. Sends embed with "Accept" and "Deny" buttons to `CALLED_CHANNEL` (Staff).
  4. Replies to author with success.

## Button Logic (`resolveJudgeCommandButtonEvents`)
- **Accept (`c-judge-accept`):**
  1. DMs the target user with the feedback.
  2. Updates target's reputation in Firebase (+1 for praise, -1 for improvement).
  3. Logs approval to staff channel.
  4. Deletes the staff request message.
- **Deny (`c-judge-deny`):**
  1. Logs denial to staff channel.
  2. Deletes the staff request message.

## Migration Plan
- **Interactivity:** Requires handling Button interactions.
- **Database:** Firebase integration for reputation.
- **Logic:** The approval workflow (Staff Channel -> DM Target) is critical.
