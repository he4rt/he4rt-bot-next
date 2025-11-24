# Event: Medal Expiration

## Trigger
Ticker: `VoiceXP` (Note: Code uses `TickerName.VoiceXP` key, likely shared or copy-paste)

## Logic
1. **Fetch:** Gets all active medal records from Firebase.
2. **Iterate:** Checks each user's `expires_at` timestamp.
3. **Check:** If `currentTime >= expires_at`:
4. **Action:**
   - Removes the medal role from the user.
   - Deletes the record from Firebase.

## Migration Plan
- **Infrastructure:** Periodic task runner.
- **Database:** Firebase integration.
- **Note:** Verify if sharing the `VoiceXP` ticker key is intended.
