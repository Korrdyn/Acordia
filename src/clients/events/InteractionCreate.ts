import { Client } from '@clients/Client';
import { Shard } from '@clients/Shard';
import { AutocompleteInteraction } from '@structures/AutocompleteInteraction';
import { CommandInteraction } from '@structures/CommandInteraction';
import { ComponentInteraction } from '@structures/ComponentInteraction';
import { Interaction } from '@structures/Interaction';
import { ModalSubmitInteraction } from '@structures/ModalSubmitInteraction';
import { PingInteraction } from '@structures/PingInteraction';
import { Events } from '@typings/events/ClientEvents';
import { GatewayInteractionCreateDispatch, InteractionType } from 'discord-api-types/v10';

export default function (client: Client, _: Shard, packet: GatewayInteractionCreateDispatch) {
  let interaction: Interaction;
  switch (packet.d.type) {
    case InteractionType.ApplicationCommand:
      interaction = new CommandInteraction(client, packet.d);
      break;
    case InteractionType.ApplicationCommandAutocomplete:
      interaction = new AutocompleteInteraction(client, packet.d);
      break;
    case InteractionType.MessageComponent:
      interaction = new ComponentInteraction(client, packet.d);
      break;
    case InteractionType.ModalSubmit:
      interaction = new ModalSubmitInteraction(client, packet.d);
      break;
    case InteractionType.Ping:
      interaction = new PingInteraction(client, packet.d);
      break;
    default:
      interaction = new Interaction(client, packet.d);
  }

  client.emit(Events.InteractionCreate, interaction);
}
