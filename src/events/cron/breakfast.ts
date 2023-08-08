import { He4rtClient } from '@/types'
import { getChannel, getGuild, getTaggedMembers } from '@/utils'
import { BREAKFAST_CATEGORY_CHANNEL } from '@/defines/ids.json'
import { CronJob } from 'cron'
import { CategoryChannel, ChannelType } from 'discord.js'

export const manageBreakfast = async (client: He4rtClient) => {
  const guild = getGuild(client)

  await new CronJob('0 6 * * *', async () => {
    client.logger.emit({
      type: 'event',
      color: 'info',
      message: '`CronJob 0 6 * * *` **do canal da manhã iniciado!**',
    })

    const parent = getChannel<CategoryChannel>({ client, id: BREAKFAST_CATEGORY_CHANNEL.id })

    const voice = await guild.channels.create({
      name: `☕ Café da Manhã - 6h/11h`,
      type: ChannelType.GuildVoice,
      parent,
      userLimit: 50,
    })

    setTimeout(async () => {
      await voice.send(`${getTaggedMembers(parent.members.map((m) => m.id))} O canal de voz será deletado daqui um minuto!`).catch(() => {})

      setTimeout(async () => {
        await voice.delete().catch(() => {})
      }, 1000 * 60)
    }, 1000 * 60 * 60 * 5)
  }).start()
}
