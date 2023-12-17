import { GifGET, He4rtClient, TickerName } from '@/types'
import {
  DYNAMIC_VOICE_DELETE_CHANNELS_IN_MINUTES,
  DYNAMIC_VOICE_INVITE_LIMIT_TIME,
  TICKER_SETTER,
  DYNAMIC_VOICE_MESSAGE_DRINK_WATER_TIME
} from '@/defines/values.json'
import { getDynamicVoiceCategory, getGuild } from '@/utils'
import { Collection, GuildMember, VoiceChannel } from 'discord.js'

export const setDynamicVoice = (client: He4rtClient) => {
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
        const channelDate = new Date(channel.createdAt).valueOf()
        const expirationLimitTime = channelDate + DYNAMIC_VOICE_INVITE_LIMIT_TIME
        const debounceTime = actuallyTime > expirationLimitTime
        const expirationDrinkWaterTime = channelDate + DYNAMIC_VOICE_MESSAGE_DRINK_WATER_TIME
        const debounceDrinkWaterTime = actuallyTime > expirationDrinkWaterTime

        const phrases = [
          "Hora de beber água antes que seus rins façam greve e exijam melhores condições de trabalho!",
          "Não ignore a mensagem para beber a awa, ela sabe quando você está desidratado. É como um pequeno detetive dentro do seu telefone.",
          "A água está te chamando! Se não atender, ela pode começar a deixar mensagens de voz.",
          "Lembre-se, sua planta de casa não é a única que precisa de água. Se hidrate, humano!",
          "Se a água fosse uma celebridade, seria a mais desejada do tapete vermelho da saúde.",
          "Se beber água fosse um esporte olímpico, você já teria ganho várias medalhas de ouro.",
          "Não seja uma poça, seja um oceano! Hora de beber água e se tornar um mar de hidratação.",
          "O bot da água diz: 'Seu corpo está 60% água, então você é basicamente uma obra de arte aquática.'",
          "Roses are red, violets are blue, water is clear, so drink a glass or two!",
          "Se a água fosse dinheiro, você seria um milionário! Hora de gastar alguns copos."
        ]

        if(targets.length > 0 && debounceDrinkWaterTime) {
          client.api.gif.get<GifGET>().then(async ({ results }) => {
            const randomIndex = Math.floor(Math.random() * results.length)
            const gif = results[randomIndex]
            channel.send(`**>>>>>>>>LEMBRETE PARA VOCÊ BEBER AWA<<<<<<<<**\n ${phrases[randomIndex]}`)
            channel.send(`${gif.url}`)
          })
          
        }

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
        }
      })
    }
  })
}
