import { defineStore as coreDefineStore, IGetters } from '@rx-free/core';
import { Ref } from 'vue';
import useRxState, { IRxStateOptions } from './useRxState';

export default function defineStore<T, Getters extends object = {}>(
  name: string,
  config: {
    initialState: T;
    dev?: boolean;
    getters?: IGetters<T, Getters>;
  }
) {
  type R = T & Getters;

  const store = coreDefineStore<T, Getters>(name, config);

  function useStore(): Ref<R>;
  function useStore<Key extends keyof R>(options: IRxStateOptions<R, Key>): Ref<Pick<R, Key>>;
  function useStore<Key extends keyof R>(options?: any) {
    return useRxState<R, Key>(store.observable$, () => store.state, options);
  }

  return Object.assign(store, { useStore });
}
