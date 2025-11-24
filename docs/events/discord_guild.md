# Event: Guild Member Updates

## Trigger
Events: `GuildMemberAdd`, `GuildMemberRemove`

## Logic
1. **Member Add:**
   - Sends a welcome DM.
   - Creates user record in Firebase.
   - Calls internal API (`client.api.he4rt.providers.discord.post`) to create account.
   - Logs entry.
2. **Member Remove:**
   - Deletes user record from Firebase.
   - Logs exit.

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Database:** Firebase integration.
