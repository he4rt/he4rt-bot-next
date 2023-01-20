import { POMODORO_CHANNEL } from '@/defines/ids.json'
import { VoiceState } from 'discord.js'

export const removeUserMuteInLeavePomodoro = (oldVoice: VoiceState, newVoice: VoiceState) => {
  if (
    (oldVoice.channelId === POMODORO_CHANNEL.id && newVoice.channelId !== POMODORO_CHANNEL.id) ||
    !newVoice.channelId
  ) {
    const target = newVoice.member

    if (target.voice.serverMute) target.voice.setMute(false).catch(() => {})
  }
}
