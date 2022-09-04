import { onUnmounted, Ref, ref } from 'vue';
import { Observable, tap } from 'rxjs';
import { distinctUntilKeysChanged } from '@rx-free/core/src/operators/distinctUntilKeysChanged';

export interface IRxStateOptions<T, Key extends keyof T = keyof T> {
  /**
   * T不为对象时不需要此配置
   */
  keys?: Key[];
}

export default function useRxState<T>(subject: Observable<T>, initialStateFactory: () => T, options?: any): Ref<T>;
export default function useRxState<T, Key extends keyof T>(
  subject: Observable<T>,
  initialStateFactory: () => T,
  options: IRxStateOptions<T, Key>
): Ref<Pick<T, Key>>;
export default function useRxState<T, Key extends keyof T>(
  observable$: Observable<T>,
  initialStateFactory: () => T,
  options: IRxStateOptions<T, Key> = {}
): Ref<Partial<T>> {
  const v = ref<Partial<T>>(initialStateFactory());

  const sub = observable$.pipe(options.keys ? distinctUntilKeysChanged(options.keys) : tap()).subscribe((st) => {
    v.value = st;
  });
  onUnmounted(() => {
    sub.unsubscribe();
  });
  return v as Ref<Partial<T>>;
}
