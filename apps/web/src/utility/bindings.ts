import { Setter, createSignal } from 'solid-js';

export function createBindings<T extends Setter<any>, U extends Parameters<T>[0]>(setter: T | undefined, bindings: U) {
  if (setter) setter(bindings);
}

export function useBindings<T>() {
  const [get, bind] = createSignal<T>();

  const use = (callback?: (bindings: T) => void) => {
    const bindings = get();

    if (callback) callback(bindings as T);

    return bindings as T;
  }

  return { use, bind };
}

export interface BindingProps<T> {
  bindings?: Setter<T | undefined>
}