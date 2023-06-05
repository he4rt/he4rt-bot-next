import { He4rtClient } from '@/types'
import { getGuild } from '@/utils'
import { QUIZ_EVENT } from '@/defines/ids.json'
import { CronJob } from 'cron'

export const verifyEventCode = async (client: He4rtClient) => {
  const guild = getGuild(client)

  await new CronJob('*/10 * * * * *', async () => {
    // TODO
    // BUSCAR TODOS OS EVENTOS QUE A DATA FINAL SEJA SUPERIOR AO DIA DE HOJE
    // AO TRAZER OS EVENTOS VERIFICAR SE A DATA INICIAL DO EVENTO É SUPERIOR AO DIA DE HOJE
    // SE FOR SUPERIOR ALTERAR O STATUS ACTIVE PARA VERDADEIRO
    // AO ATIVAR O EVENT ENVIAR MENSAGEM PARA O CANAL DE QUIZ INFORMANDO QUE O EVENTO ESTÁ DISPONÍVEL PARA PARTICIPAR
    // QUANDO A DATA DE HOJE FOR SUPERIOR A DATA FINAL ALTERAR O STATUS DO EVENTO PARA INATIVO
  }).start()
}
