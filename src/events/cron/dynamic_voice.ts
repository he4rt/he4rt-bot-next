import { GifGET, He4rtClient } from '@/types'
import { getDynamicVoiceCategory, getGuild } from '@/utils'
import { CronJob } from 'cron'
import { Collection, GuildMember, VoiceChannel } from 'discord.js'


export const sendDrinkWaterReminderInDynamicVoiceChannels = async (client: He4rtClient) => {
  const guild = getGuild(client)

  await new CronJob('40 * * * * *', async () => {
    client.logger.emit({
      type: 'event',
      color: 'warning',
      message: '`CronJob 40 * * * * *` **enviado mensagem para lembrente de beber água nos canais ativos de voz dinâmica**',
    })

    const category = getDynamicVoiceCategory(client)
      const channels = [...guild.channels.cache] as [string, VoiceChannel][]

      channels.forEach(async ([_, channel]) => {
        if (channel.parentId !== category.id) return

        const targets = [...(channel.members as Collection<string, GuildMember>)]

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

        if(targets.length > 0) {
          client.api.gif.get<GifGET>().then(async ({ results }) => {
            const randomIndex = Math.floor(Math.random() * results.length)
            const gif = results[randomIndex]
            channel.send(`**Hey!! Lembre de beber água**\n ${phrases[randomIndex]}`)
            channel.send(`${gif.url}`)
          })
          
        }
      })
  }).start()
}
