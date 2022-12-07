import { POMODORO_CHANNEL, MEETING_VOICE_CHANNEL } from '@/defines/ids.json'
import { VoiceState } from 'discord.js'

export const removeUserMuteInLeavePomodoro = (oldVoice: VoiceState, newVoice: VoiceState) => {
  if (oldVoice.channelId === POMODORO_CHANNEL.id && newVoice.channelId !== POMODORO_CHANNEL.id) {
    newVoice.member.voice.setMute(false).catch(() => {})
  }
}

export const weeklyMeetingVoiceController = (oldVoice: VoiceState, newVoice: VoiceState) => {
  const targets = [MEETING_VOICE_CHANNEL]

  const userLeaveVoice = targets.some((c) => c.id === oldVoice.id && c.id !== newVoice.id)
  const userEnterVoice = targets.some((c) => c.id !== oldVoice.id && c.id === newVoice.id)

  if (userLeaveVoice) {
    // TODO: api request if user leave voice here
  }

  if (userEnterVoice) {
    // TODO: api request if user enter voice here
  }
}
