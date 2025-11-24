# Event: Discord Presence

## Trigger
Ticker: `DiscordPresence`

## Logic
1. **Rotate:** Picks a random activity from a predefined list.
2. **Update:** Sets the bot's presence (`client.user.setPresence`).

## Migration Plan
- **Logic:** Simple presence rotation.
