# Event: Voice State Update

## Trigger
Event: `VoiceStateUpdate`

## Logic
1. **Pomodoro Exit:** If a user leaves the Pomodoro channel, ensures they are unmuted (server mute).

## Migration Plan
- **Logic:** Critical for user experience (preventing stuck mutes).
