import { Interaction } from '@structures/Interaction';
import { InteractionResponseType } from 'discord-api-types/v10';

export class PingInteraction extends Interaction {
  pong() {
    return this.respond({ type: InteractionResponseType.Pong });
  }
}
