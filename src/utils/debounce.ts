/**
 * Options to configure the debounce behavior.
 */
export interface DebounceOptions {
  /**
   * Time in milliseconds to wait before allowing the next call.
   */
  wait: number;
}

/**
 * A debounced version of the original function with additional control methods.
 */
export interface Debounced<F extends (...args: unknown[]) => unknown> {
  /**
   * Invokes the debounced function, if the delay has passed.
   */
  (...args: Parameters<F>): ReturnType<F> | void;

  /**
   * Cancels any pending invocation.
   */
  cancel(): void;

  /**
   * Immediately invokes the function if there's a pending call.
   */
  flush(): ReturnType<F> | void;

  /**
   * Forces the next call to bypass the debounce delay.
   */
  forceNext(): void;
}

/**
 * Creates a debounced version of the provided function.
 *
 * @param fn - The original function to debounce.
 * @param opts - Configuration options to control debounce timing and behavior.
 * @returns A debounced function with cancel, flush, and forceNext methods.
 */
export function debounce<F extends (...args: unknown[]) => unknown>(
  fn: F,
  opts: DebounceOptions
): Debounced<F> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<F> | null = null;
  let lastThis: unknown = null;

  const { wait } = opts;

  const invoke = (): ReturnType<F> | void => {
    if (lastArgs) {
      const result = fn.apply(lastThis, lastArgs) as ReturnType<F>;
      lastArgs = null;
      return result;
    }
    return undefined;
  };

  const debounced: Debounced<F> = function (this: unknown, ...args: Parameters<F>) {
    lastArgs = args;
    // We're saving `this` context explicitly because `fn` might rely on it during later invocation.
    // This is necessary to preserve correct behavior when using `flush()` or `forceNext()`,
    // especially when debounce is applied to class or object methods.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(invoke, wait);
  };

  debounced.forceNext = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    invoke();
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
    lastArgs = null;
  };

  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      return invoke();
    }
    return undefined;
  };

  return debounced;
}
