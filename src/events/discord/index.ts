import { Events, GuildMember } from 'discord.js'
import { buttonListener, commandsListener } from '@/commands'
import { He4rtClient } from '@/types'
import { XPListener } from './gamification'
import { isBot, isValidXPMessage } from '@/utils'
import { createUserInServerEnter, deletePossibleUserInServerLeave } from './guild'
import {
  reactMessagesInSuggestionChannel,
  sendGoodMessagesInBusyChannels,
  suppressEmbedMessagesInBusyChannels,
  reactMessagesInLearningDiaryChannel,
  reactAnnouncesInAdvertsChannel,
  reactEmbedsInPresentationsChannel,
} from './channel'
import { setMemberIsADonatorOrNot } from './role'
import { weeklyMeetingVoiceController, removeUserMuteInLeavePomodoro } from './voice'
import { emitDefaultDiscordError, emitWebhookUpdate } from './logger'

export const discordEvents = (client: He4rtClient) => {
  client.on(Events.GuildMemberAdd, (member) => {
    if (isBot(member.user)) return

    createUserInServerEnter(client, member)
  })

  client.on(Events.GuildMemberRemove, (member) => {
    if (isBot(member.user)) return

    deletePossibleUserInServerLeave(client, member)
  })

  client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
    if (isBot(oldMember.user) || isBot(newMember.user) || !oldMember) return

    setMemberIsADonatorOrNot(client, oldMember as GuildMember, newMember)
  })

  client.on(Events.VoiceStateUpdate, (oldVoice, newVoice) => {
    weeklyMeetingVoiceController(oldVoice, newVoice)
    removeUserMuteInLeavePomodoro(oldVoice, newVoice)
  })

  client.on(Events.MessageCreate, (message) => {
    reactAnnouncesInAdvertsChannel(message)

    if (isBot(message.author)) return

    if (isValidXPMessage(message)) {
      XPListener(client, message)
    }

    suppressEmbedMessagesInBusyChannels(message)
    sendGoodMessagesInBusyChannels(message)
    reactEmbedsInPresentationsChannel(message)
    reactMessagesInSuggestionChannel(message)
    reactMessagesInLearningDiaryChannel(message)
  })

  client.on(Events.InteractionCreate, (interaction) => {
    if (interaction.isChatInputCommand()) commandsListener(client, interaction)
    if (interaction.isButton()) buttonListener(client, interaction)
  })

  client.on(Events.Error, (error) => {
    emitDefaultDiscordError(client, error)
  })

  client.on(Events.WebhooksUpdate, (event) => {
    emitWebhookUpdate(client, event)
  })
}
