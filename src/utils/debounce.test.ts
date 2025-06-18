import { debounce } from './debounce';

jest.useFakeTimers();

describe('debounce', () => {
  let fn: jest.Mock;
  let context: { value: number };

  beforeEach(() => {
    fn = jest.fn();
    context = { value: 42 };
  });

  it('delays function execution by wait time', () => {
    const debounced = debounce(fn, { wait: 100 });

    debounced('a');
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('resets timer if called again within wait', () => {
    const debounced = debounce(fn, { wait: 100 });

    debounced('a');
    jest.advanceTimersByTime(50);
    debounced('b');
    jest.advanceTimersByTime(50); // still only 50ms from last call
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50); // 100ms total from last call
    expect(fn).toHaveBeenCalledWith('b');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('flush executes function immediately', () => {
    const debounced = debounce(fn, { wait: 100 });

    debounced('hello');
    debounced.flush();

    expect(fn).toHaveBeenCalledWith('hello');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('cancel prevents function from being called', () => {
    const debounced = debounce(fn, { wait: 100 });

    debounced('cancelled');
    debounced.cancel();

    jest.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  it('forceNext triggers immediate execution and resets timer', () => {
    const debounced = debounce(fn, { wait: 100 });

    debounced('first');
    debounced.forceNext(); // immediate
    expect(fn).toHaveBeenCalledWith('first');
    expect(fn).toHaveBeenCalledTimes(1);

    debounced('second');
    jest.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1); // still waiting

    debounced.forceNext();
    expect(fn).toHaveBeenCalledWith('second');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('preserves this context', () => {
    const log = jest.fn(function (this: { value: number }, label: string) {
      return this.value + ' ' + label;
    }) as jest.MockedFunction<(...args: unknown[]) => unknown>;

    const debounced = debounce(log, { wait: 100 });

    debounced.call(context, 'world');
    debounced.flush();

    expect(log.mock.instances[0]).toEqual(context);
    expect(log).toHaveBeenCalledWith('world');
  });
});
