import { SearchArgs } from './types';

export function searchArgsToWeb(args: SearchArgs) {
  const params = new URLSearchParams();

  for (const entry of Object.entries(args)) {
    params.set(entry[0], entry[1].toString());
  }

  return params
}