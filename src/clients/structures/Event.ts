import { Events } from '@typings/events/ClientEvents';

interface Event<Context> {
  id: string;
  event: Events;
  handle(context: Context, arg?: any, arg2?: any, arg3?: any): any;
}

export default Event;
