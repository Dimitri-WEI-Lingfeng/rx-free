import { distinctUntilChanged, MonoTypeOperatorFunction } from 'rxjs';

export function distinctUntilKeysChanged<T>(keys: (keyof T)[]): MonoTypeOperatorFunction<T> {
  return distinctUntilChanged((pre: T, cur: T) => keys.every((k) => Object.is(pre[k], cur[k])));
}
