import { He4rtClient, TickerName } from '@/types'
import {
  DYNAMIC_VOICE_DELETE_CHANNELS_IN_MINUTES,
  DYNAMIC_VOICE_INVITE_LIMIT_TIME,
  DYNAMIC_VOICE_MESSAGE_LIMIT_FOR_DELETE,
  TICKER_SETTER,
} from '@/defines/values.json'
import { BOT_ID } from '@/defines/ids.json'
import { getDynamicVoiceCategory, getGuild, js } from '@/utils'
import { Collection, GuildMember, VoiceChannel } from 'discord.js'

export const setDynamicVoiceRemover = (client: He4rtClient) => {
  const guild = getGuild(client)

  const voiceTimer = 60 * DYNAMIC_VOICE_DELETE_CHANNELS_IN_MINUTES
  let voiceCounterInSeconds = TICKER_SETTER

  client.ticker.add(TickerName.DynamicVoice, () => {
    --voiceCounterInSeconds

    if (voiceCounterInSeconds <= 0) {
      voiceCounterInSeconds = voiceTimer

      const category = getDynamicVoiceCategory(client)
      const channels = [...guild.channels.cache] as [string, VoiceChannel][]

      channels.forEach(async ([_, channel]) => {
        if (channel.parentId !== category.id) return

        const targets = [...(channel.members as Collection<string, GuildMember>)]

        const actuallyTime = new Date().valueOf()
        const expirationLimitTime = new Date(channel.createdAt).valueOf() + DYNAMIC_VOICE_INVITE_LIMIT_TIME

        const debounceTime = actuallyTime > expirationLimitTime

        // first, check if this channel is valid for delete
        if (targets.length === 0 && debounceTime) {
          channel
            .delete()
            .then(() => {
              client.logger.emit({
                message: `O canal de voz dinâmico **${channel.id}** foi deletado automaticamente com sucesso!`,
                type: 'command',
                color: 'info',
              })
            })
            .catch(() => {
              client.logger.emit({
                message: `O canal de voz dinâmico **${channel.id}** não foi deletado!`,
                type: 'command',
                color: 'error',
              })
            })

          return
        }

        // second, check if this channel is valid for bulk delete messages because 100 messages discord.js limit for search in fetched cases.
        // this is a workaround for /sala-limite and /sala-transferir. Better suggestions are welcome.
        channel.messages
          .fetch({ limit: DYNAMIC_VOICE_MESSAGE_LIMIT_FOR_DELETE, cache: false })
          .then(async (payload) => {
            // exclude bot messages (especially controller with embeds)
            const messages = payload.filter((msg) => msg && msg.author.id !== BOT_ID)

            if ([...messages]?.length >= DYNAMIC_VOICE_MESSAGE_LIMIT_FOR_DELETE) {
              const before = await channel.send(
                `Apaguarei as últimas ${DYNAMIC_VOICE_MESSAGE_LIMIT_FOR_DELETE} mensagens daqui 10 segundos para o melhor funcionamento do canal dinâmico!!!`
              )
              await js().sleep(10000)

              // delete target messages
              await channel.bulkDelete(messages).catch(() => {})

              const current = await channel.send(
                `Apagando as últimas ${DYNAMIC_VOICE_MESSAGE_LIMIT_FOR_DELETE} mensagens!`
              )

              setTimeout(() => {
                before.delete().catch(() => {})
                current.delete().catch(() => {})
              }, 10000)
            }
          })
          .catch(() => {})
      })
    }
  })
}
