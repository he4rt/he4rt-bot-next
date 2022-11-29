import { POMODORO_CHANNEL } from '@/defines/ids.json'
import { VoiceState } from 'discord.js'

export const removeUserMuteInLeavePomodoro = (oldVoice: VoiceState, newVoice: VoiceState) => {
  if (oldVoice.channelId === POMODORO_CHANNEL.id && newVoice?.channelId !== POMODORO_CHANNEL.id) {
    newVoice.member.voice.setMute(false).catch(() => {})
  }
}
