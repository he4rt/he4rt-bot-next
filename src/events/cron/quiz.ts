import { getEvents, updateEventStatus } from '@/http/firebase'
import { He4rtClient } from '@/types'
import { embedTemplate, getChannel } from '@/utils'
import { CronJob } from 'cron'
import { QUIZ_EVENT } from '@/defines/ids.json'

export const everyQuizEvent = async (client: He4rtClient) => {

  await new CronJob('0 * * * *', async () => {
    const events = await getEvents(client)
    const today = new Date()

    const currentEvent = events.reduce((result, event) => {
      if (today >= event.date_start.toDate() && today <= event.date_end.toDate()) {
        return event
      }
      return result
    }, null)
    

    if(!currentEvent.is_active) {
      updateEventStatus(client, currentEvent)
      const chat = getChannel({ id: QUIZ_EVENT.id, client })
      const embed = embedTemplate({
        title: 'Novo evento de Q&A disponível 👋',
        description: `@everyone ${currentEvent.description}`
      })
      await chat.send({ embeds: [embed] })
    }

    events.forEach((event) => {
      if(event.is_active && event.date_end.toDate() < today) {
        updateEventStatus(client, event)
      }
    })
  }).start()
}
