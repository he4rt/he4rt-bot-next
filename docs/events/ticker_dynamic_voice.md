# Event: Dynamic Voice Cleanup

## Trigger
Ticker: `DynamicVoice` (Runs periodically)

## Logic
1. **Scan:** Iterates through all channels in the `DYNAMIC_CATEGORY_CHANNEL`.
2. **Filter:** Ignores channels in the ignore list.
3. **Check:**
   - Is the channel empty (0 members)?
   - Is the channel older than `DYNAMIC_VOICE_INVITE_LIMIT_TIME`?
4. **Action:** If both true, deletes the channel.

## Migration Plan
- **Infrastructure:** Requires a periodic task runner (Ticker).
- **Configuration:** `DYNAMIC_CATEGORY_CHANNEL` ID.
