# Event: Voice XP

## Trigger
Ticker: `VoiceXP`

## Logic
1. **Scan:** Iterates through all members in voice channels.
2. **Filter:** Excludes members in `AWAY_VOICE_CHANNEL` (AFK).
3. **Determine State:**
   - `muted`: Able to hear but muted.
   - `unmuted`: Able to hear and speak.
   - `disabled`: Deafened (Self or Server).
4. **Action:** Calls internal API (`client.api.he4rt.voices.discord.post`) to award XP based on state.

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Logic:** Periodic XP award logic.
