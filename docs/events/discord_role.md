# Event: Role Updates

## Trigger
Event: `GuildMemberUpdate`

## Logic
1. **Privilege Check:** If a user loses "Privileged" status (Booster/Patron), their custom color role is deleted.
2. **Boost Message:** If a user starts boosting, sends a thank you message in Chat.
3. **Nitro Status:** Updates the user's `nitro` status in Firebase when they start/stop boosting.

## Migration Plan
- **Database:** Firebase integration.
- **Logic:** Role monitoring.
