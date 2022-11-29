import { He4rtClient, WebhookEvent } from '@/types'

export const emitDefaultDiscordError = (client: He4rtClient, { name, message }: Error) => {
  client.logger.emit({
    message: `Um erro genérico foi emitido!: **[${name}]** - ${message}`,
    type: 'discord',
    color: 'error',
  })
}

export const emitWebhookUpdate = (client: He4rtClient, event: WebhookEvent) => {
  client.logger.emit({
    message: `Um evento de webhook foi emitido!: **[${event.id}]** - **${event.name}**`,
    type: 'discord',
    color: 'info',
  })
}
