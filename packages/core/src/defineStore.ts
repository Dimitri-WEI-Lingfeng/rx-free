import { ReplaySubject } from 'rxjs';
import { produce } from 'immer';

interface TStore {
  dispatch: (action: { type: string; payload: any }) => void;
}

let reduxStore: Promise<TStore>;

function dispatchToReduxDevtools(action: { type: string; payload: any }) {
  if (reduxStore) {
    reduxStore.then((store) => {
      store.dispatch(action);
    });
  } else {
    if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
      reduxStore = import('redux').then(({ createStore }) => {
        return createStore(
          (state, action) => {
            const { type, payload } = action as { type: string; payload: any };
            state[type] = payload;
            return state;
          },
          {} as any,
          (window as any).__REDUX_DEVTOOLS_EXTENSION__({ name: 'rx-store' })
        );
      });
      reduxStore.then((store) => {
        store.dispatch(action);
      });
    }
  }
}

// TODO: disallow declare key of T in getters
export type IGetters<T, Getters> = {
  [k in keyof Getters]: {
    getter: (st: T & Getters) => Getters[k];
    deps?: (keyof (T & Getters))[];
  };
};

function generateGettersValuesFunc<T, Getters extends object>() {
  const cached: { [k in keyof Getters]?: { previousDepValues: Array<any>; value: Getters[k] } } = {};

  return function getGettersValues(st: T, getters?: IGetters<T, Getters>): Getters {
    // @ts-ignore
    const gettersValue: Getters = {};
    if (!getters) return gettersValue;

    function depsChanged(key: keyof Getters): boolean {
      const cachedValue = cached[key];
      const deps = getters![key].deps;
      if (!cachedValue || !deps) {
        return true;
      } else {
        return !deps.every((k, i) =>
          Object.is(
            cachedValue.previousDepValues[i],
            allKeysSet.has(k) ? gettersValue[k as keyof Getters] : st[k as keyof T]
          )
        );
      }
    }

    const gettersCopy = { ...getters };
    const allKeysSet: Set<string | symbol | number> = new Set(Object.keys(getters));

    // keys deferred to calculate
    const deferredKeys: (keyof Getters)[] = [];
    const calculated: Set<string | symbol | number> = new Set();
    let loopCount = 0;
    const maxLoopCount = 1000;
    while (Object.keys(gettersCopy).length || deferredKeys.length) {
      loopCount++;
      if (loopCount > maxLoopCount) {
        throw new Error('Max loop，please ensure your getters deps are not cyclicly referencing');
      }
      let key: keyof Getters;
      if (!Object.keys(gettersCopy).length) {
        key = deferredKeys.shift()!;
      } else {
        key = Array.from(Object.keys(gettersCopy))[0] as keyof Getters;
        delete gettersCopy[key];
      }
      const getter = getters[key];
      const deps = getter.deps;
      if (!deps) {
        gettersValue[key] = getter.getter({ ...st, ...gettersValue });
        calculated.add(key);
        continue;
      }
      if (deps.filter((k) => allKeysSet.has(k)).every((k) => calculated.has(k))) {
        if (depsChanged(key)) {
          gettersValue[key] = getter.getter({ ...st, ...gettersValue });
          cached[key] = {
            previousDepValues: deps.map((k) =>
              allKeysSet.has(k) ? gettersValue[k as keyof Getters] : st[k as keyof T]
            ),
            value: gettersValue[key]
          };
        } else {
          gettersValue[key] = cached[key]!.value;
        }
        calculated.add(key);
      } else {
        deferredKeys.push(key);
      }
    }
    return gettersValue;
  };
}
export function defineStore<T, Getters extends object>(
  name: string,
  config: {
    initialState: T;
    dev?: boolean;
    getters?: IGetters<T, Getters>;
  }
) {
  const { initialState } = config;
  type R = T & Getters;
  const subject$ = new ReplaySubject<T>(1);
  let observable$: ReplaySubject<R> = subject$ as any;
  const getGettersValues = generateGettersValuesFunc<T, Getters>();
  const stateWithGettersRef: { value: R } = {
    value: {
      ...initialState,
      ...getGettersValues(initialState, config.getters)
    }
  };

  subject$.next(stateWithGettersRef.value)

  if (config.getters) {
    observable$ = new ReplaySubject<R>(1);
    subject$.subscribe((st) => {
      observable$.next({
        ...st,
        ...getGettersValues(st, config.getters)
      });
    });
  }

  observable$.subscribe((v) => {
    if (config.dev || process.env.NODE_ENV !== 'production') {
      const type = name || 'unknown';
      const payload = v;
      dispatchToReduxDevtools({ type, payload });
    }
    stateWithGettersRef.value = v;
  });

  function updateStore(mutation: (state: R) => void) {
    subject$.next(produce(stateWithGettersRef.value, mutation));
  }

  const readonlyStateRef: {
    readonly value: R;
  } = stateWithGettersRef;

  return {
    observable$,
    setStore: updateStore,
    get state() {
      return readonlyStateRef.value;
    }
  };
}
