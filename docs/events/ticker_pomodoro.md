# Event: Pomodoro

## Trigger
Ticker: `Pomodoro`

## Logic
1. **State Machine:** Toggles between "Talking" and "Mutated" states based on timers.
2. **Talking State:**
   - Unmutes everyone.
   - Sets channel name to "🟢 Pomodoro".
   - Sends countdown messages (5m, 1m).
3. **Mutated State:**
   - Mutes everyone.
   - Sets channel name to "🔴 Pomodoro".
   - Sends countdown messages (40m, 20m, 10m, 1m).
4. **Enforcement:** Periodically re-applies mute/unmute state to members in the channel.

## Migration Plan
- **Infrastructure:** Periodic task runner.
- **Logic:** Stateful logic needs to be preserved.
