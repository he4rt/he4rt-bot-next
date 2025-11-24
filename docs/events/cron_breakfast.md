# Event: Breakfast Channel

## Trigger
Cron Job: `0 0 6 * * *` (Every day at 06:00)

## Logic
1. **Create:** Creates a voice channel "☕ Café da Manhã - 6h/11h" in the Dynamic Category.
2. **Wait:** Sets a timeout for 5 hours (until 11:00).
3. **Announce:** At 11:00, sends a random "Work/Lunch" phrase to the channel, tagging all members in it.
4. **Rename:** 1 minute later (11:01), renames the channel to "Trabalho".

## Migration Plan
- **Infrastructure:** Requires a scheduler/cron system.
- **Logic:** The nested timeouts are a bit fragile if the bot restarts. Consider splitting into two cron jobs (one at 6:00, one at 11:00) for better reliability.
