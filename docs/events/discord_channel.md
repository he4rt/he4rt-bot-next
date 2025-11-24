# Event: Channel Messages

## Trigger
Event: `MessageCreate`

## Logic
1. **Message Listener:** Logs every message to the internal API (`client.api.he4rt.messages`).
2. **Embed Suppression:** In busy channels (Chat, Meetings), suppresses embeds unless the user is Admin or the content is an image/proxy.
3. **Greetings:** Replies to "Bom dia", "Boa tarde", etc. in busy channels based on the time of day.
4. **Bussin/Cap:** Randomly replies "bussin", "cap", or "no cap" to messages mentioning "Rust" or "Go" (Easter Egg).
5. **Reactions:**
   - **Suggestion Channel:** Adds ✅ and ❌.
   - **Learning Diary, Adverts, Depositions:** Adds He4rt emoji.

## Migration Plan
- **External Dependency:** Internal API (`client.api.he4rt`).
- **Logic:** Several small utility functions attached to the message event.
