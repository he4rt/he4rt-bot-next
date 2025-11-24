# Event: Apoiase Verification

## Trigger
Cron Job: `00 00 12 10 * *` (10th of every month at 12:00)

## Logic
1. **Fetch:** Gets all members with the "Apoiase" role.
2. **Iterate:** Checks each member against the Apoia.se API.
3. **Validate:**
   - Checks if `isBacker` is true.
   - Checks if `isPaidThisMonth` is true.
   - Checks if `thisMonthPaidValue` meets the minimum.
4. **Action:**
   - **Valid:** Updates Firebase with payment info. Logs success.
   - **Invalid:** Removes "Apoiase" role. DMs the user explaining why. Logs warning.

## Migration Plan
- **Infrastructure:** Requires a scheduler/cron system.
- **Dependencies:** Apoia.se API, Firebase.
