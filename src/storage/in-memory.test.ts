import { InMemoryStorage } from './in-memory';

describe('InMemoryStorage', () => {
  it('adds and queries all', () => {
    const storage = new InMemoryStorage();
    storage.add({ id: '1', tags: ['a', 'b'] });
    storage.add({ id: '2', tags: ['b', 'c'] });

    const result = storage.query();
    expect(result).toHaveLength(2);
  });

  it('throws on duplicate id', () => {
    const storage = new InMemoryStorage();
    storage.add({ id: '1', tags: ['a'] });
    expect(() => storage.add({ id: '1', tags: ['b'] })).toThrow();
  });

  it('filters by multiple tags', () => {
    const storage = new InMemoryStorage();
    storage.add({ id: '1', tags: ['a', 'b', 'c'] });
    storage.add({ id: '2', tags: ['a', 'c'] });

    const result = storage.query({ tags: ['a', 'c'] });
    expect(result.map(r => r.id)).toContain('1');
    expect(result.map(r => r.id)).toContain('2');
  });
});
