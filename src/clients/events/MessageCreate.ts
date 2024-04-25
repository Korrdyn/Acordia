import { GatewayMessageCreateDispatch } from 'discord-api-types/v10';
import { Client } from '@clients/Client';
import { Shard } from '@clients/Shard';
import { Events } from '@typings/events/ClientEvents';

export default function (client: Client, _: Shard, packet: GatewayMessageCreateDispatch) {
  const data = packet.d;
  if ('guild_id' in data) {
    const guild = client.guilds.get(data.guild_id);
    if (!guild) return;
    const channel = guild.channels.get(data.channel_id);
    if (!channel?.isTextBased()) return;
    const message = channel.messages.add(data);
    client.emit(Events.MessageCreate, message);
  } else {
    // TODO: Handle DMs
  }
}
