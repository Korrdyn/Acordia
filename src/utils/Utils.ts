import { Collection } from '@discordjs/collection';
import { Client } from '@clients/Client';

// https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Util.js#L17
const isObject = (d: Record<any, any> | null) => typeof d === 'object' && d !== null;
export function flatten(obj: any, props?: Record<string, string | boolean>) {
  if (!isObject(obj)) return obj;

  const objProps = Object.keys(obj)
    .filter((key) => !key.startsWith('_'))
    .map((key) => ({ [key]: true }));

  if (!props) props = {};
  // @ts-ignore
  props = objProps.length ? Object.assign(...objProps, ...[props]) : Object.assign({}, ...[props]);

  const out: Record<string, any> = {};

  for (let [prop, newProp] of Object.entries(props!)) {
    console.log(prop, newProp);
    if (!newProp) continue;
    newProp = newProp === true ? prop : newProp;

    const element = obj[prop];
    // Will reach max stack if we try to flatten client
    if (element instanceof Client) continue;
    const elemIsObj = isObject(element);
    const valueOf = elemIsObj && typeof element.valueOf === 'function' ? element.valueOf() : null;
    const hasToJSON = elemIsObj && typeof element.toJSON === 'function';

    // If it's a Collection, make the array of keys
    if (element instanceof Collection) out[newProp] = Array.from(element.keys());
    // If the valueOf is a Collection, use its array of keys
    else if (valueOf instanceof Collection) out[newProp] = Array.from(valueOf.keys());
    // If it's an array, call toJSON function on each element if present, otherwise flatten each element
    else if (Array.isArray(element)) out[newProp] = element.map((elm) => elm.toJSON?.() ?? flatten(elm));
    // If it's an object with a primitive `valueOf`, use that value
    else if (typeof valueOf !== 'object') out[newProp] = valueOf;
    // If it's an object with a toJSON function, use the return value of it
    else if (hasToJSON) out[newProp] = element.toJSON();
    // If element is an object, use the flattened version of it
    else if (typeof element === 'object') out[newProp] = flatten(element);
    // If it's a primitive
    else if (!elemIsObj) out[newProp] = element;
  }

  return out;
}
