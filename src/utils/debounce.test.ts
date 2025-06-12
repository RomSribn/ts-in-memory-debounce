import { debounce } from './debounce';

jest.useFakeTimers();

describe('debounce', () => {
    it('calls function immediately after forceNext', () => {
        const fn = jest.fn();
        const debounced = debounce(fn, { wait: 100 });

        debounced('hello');
        debounced.forceNext();

        expect(fn).toHaveBeenCalledWith('hello');
    });
});
