import { Events, GuildMember } from 'discord.js'
import { buttonListener, commandsListener } from '@/commands'
import { He4rtClient } from '@/types'
import { isBot, isValidMessage } from '@/utils'
import { userEnter, userLeave, sendDmToNewUser } from './guild'
import {
  reactMessagesInSuggestionChannel,
  sendGoodMessagesInBusyChannels,
  suppressEmbedMessagesInBusyChannels,
  reactMessagesInLearningDiaryChannel,
  reactAnnouncesInAdvertsChannel,
  bussinOrCap,
  MessageListener,
  reactMessagesInDepositionsChannel,
  deletePinningMessagesInPresentationChannel,
} from './channel'
import { setMemberIsAPrivilegedOrNot, setMemberIsANitroOrNot, userBoostingServerMessage } from './role'
import { removeUserMuteInLeavePomodoro } from './voice'
import { emitDefaultDiscordError, emitWebhookUpdate } from './logger'

export const discordEvents = async (client: He4rtClient) => {
  client.on(Events.GuildMemberAdd, (member) => {
    if (isBot(member.user)) return

    userEnter(client, member)
    sendDmToNewUser(client, member)
  })

  client.on(Events.GuildMemberRemove, (member) => {
    if (isBot(member.user)) return

    userLeave(client, member)
  })

  client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    if (isBot(oldMember.user) || isBot(newMember.user) || !oldMember) return

    await setMemberIsAPrivilegedOrNot(client, oldMember as GuildMember, newMember)
    await setMemberIsANitroOrNot(client, oldMember as GuildMember, newMember)
    await userBoostingServerMessage(client, oldMember as GuildMember, newMember)
  })

  client.on(Events.VoiceStateUpdate, (oldVoice, newVoice) => {
    removeUserMuteInLeavePomodoro(oldVoice, newVoice)
  })

  client.on(Events.MessageCreate, (message) => {
    reactAnnouncesInAdvertsChannel(message)
    deletePinningMessagesInPresentationChannel(message)

    if (isBot(message.author)) return

    if (isValidMessage(message)) {
      MessageListener(client, message)
    }

    suppressEmbedMessagesInBusyChannels(message)
    sendGoodMessagesInBusyChannels(message)
    bussinOrCap(message)
    reactMessagesInSuggestionChannel(message)
    reactMessagesInLearningDiaryChannel(message)
    reactMessagesInDepositionsChannel(message)
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
