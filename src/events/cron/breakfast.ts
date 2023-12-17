import { He4rtClient } from '@/types'
import { getChannel, getGuild, getTaggedMembers } from '@/utils'
import { DYNAMIC_CATEGORY_CHANNEL } from '@/defines/ids.json'
import { CronJob } from 'cron'
import { CategoryChannel, ChannelType } from 'discord.js'

export const manageBreakfast = async (client: He4rtClient) => {
  const guild = getGuild(client)

  await new CronJob('0 0 6 * * *', async () => {
    client.logger.emit({
      type: 'event',
      color: 'info',
      message: '`CronJob 0 6 * * *` **do canal da manhã iniciado!**',
    })

    const parent = getChannel<CategoryChannel>({ client, id: DYNAMIC_CATEGORY_CHANNEL.id })
    
    const voice = await guild.channels.create({
      name: `☕ Café da Manhã - 6h/11h`,
      type: ChannelType.GuildVoice,
      parent,
      userLimit: 50,
    })

    const phrases = [
      'A alegria dura uma noite mas as contas vem pela manhã, bora trabaia!',
      'O sol nasce, a bicicleta anda o lobo uiva e o urso panda!',
      'É galera bora trabalhar e aguardar o Al-Mosso, alias já pode? https://www.jahpodealmossar.com.br/',
      'Todos podem vencer menos os seus boletos, bora trabalhar!!',
      'Nem só de café vive o homi, e as conta fi?'
    ];

    const indexPharseDay = Math.floor(Math.random() * phrases.length)

    setTimeout(async () => {
      await voice.send(`${getTaggedMembers(voice.members.map((m) => m.id))} ${phrases[indexPharseDay]}`).catch(() => {})

      setTimeout(async () => {
        await voice.edit({name: "Trabalho"}).catch(() => {})
      }, 1000 * 60)
    }, 1000 * 60 * 60 * 5)
  }).start()
}
