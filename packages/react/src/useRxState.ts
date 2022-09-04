import { useState, useEffect, useMemo } from 'react';
import { Observable, tap } from 'rxjs';
import { distinctUntilKeysChanged } from '@rx-free/core/src/operators/distinctUntilKeysChanged';

export interface IRxStateOptions<T, Key extends keyof T = keyof T> {
  /**
   * T不为对象时不需要此配置
   */
  keys?: Key[];
}

export default function useRxState<T>(subject: Observable<T>, initialStateFactory: () => T, options?: any): T;
export default function useRxState<T, Key extends keyof T>(
  subject: Observable<T>,
  initialStateFactory: () => T,
  options: IRxStateOptions<T, Key>
): Pick<T, Key>;

export default function useRxState<T, Key extends keyof T>(
  observable$: Observable<T>,
  initialStateFactory: () => T,
  options: IRxStateOptions<T, Key> = {}
): Partial<T> {
  const initialState = useMemo<T>(() => initialStateFactory(), []);
  const [state, setState] = useState(initialState);
  useEffect(() => {
    const sub = observable$
      .pipe(options.keys ? distinctUntilKeysChanged(options.keys || []) : tap())
      .subscribe((st) => {
        setState(st);
      });
    return sub.unsubscribe.bind(sub);
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);
  return state;
}
