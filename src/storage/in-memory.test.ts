import { InMemoryStorage, StorageError } from './in-memory';
import { Record, QueryCriteria } from './interfaces';

describe('InMemoryStorage', () => {
  let storage: InMemoryStorage;

  beforeEach(() => {
    storage = new InMemoryStorage();
  });

  it('adds and queries all', () => {
    storage.add({ id: '1', tags: ['a', 'b'] });
    storage.add({ id: '2', tags: ['b', 'c'] });

    const result = storage.query();
    expect(result).toHaveLength(2);
  });

  it('throws on duplicate id', () => {
    storage.add({ id: '1', tags: ['a'] });
    expect(() => storage.add({ id: '1', tags: ['b'] })).toThrow(StorageError);
  });

  it('filters by multiple tags', () => {
    storage.add({ id: '1', tags: ['a', 'b', 'c'] });
    storage.add({ id: '2', tags: ['a', 'c'] });

    const result = storage.query({ tags: ['a', 'c'] });
    expect(result.map(r => r.id)).toEqual(expect.arrayContaining(['1', '2']));
  });

  it('filters by id', () => {
    storage.add({ id: 'xyz', tags: ['alpha'] });
    const result = storage.query({ id: 'xyz' });
    expect(result).toHaveLength(1);
    expect(result[0].tags).toContain('alpha');
  });

  it('returns all for empty tags', () => {
    storage.add({ id: '1', tags: ['x'] });
    storage.add({ id: '2', tags: ['y'] });

    const result = storage.query({ tags: [] });
    expect(result).toHaveLength(2);
  });

  it('removes records by id', () => {
    storage.add({ id: 'toRemove', tags: ['z'] });
    const removed = storage.remove('toRemove');
    expect(removed).toBe(true);
    expect(storage.query()).toHaveLength(0);
  });

  it('remove returns false if record not found', () => {
    const removed = storage.remove('unknown');
    expect(removed).toBe(false);
  });

  it('updates existing record', () => {
    storage.add({ id: 'editMe', tags: ['old'] });
    storage.update({ id: 'editMe', tags: ['new'] });

    const updated = storage.query({ id: 'editMe' })[0];
    expect(updated.tags).toContain('new');
    expect(updated.tags).not.toContain('old');
  });

  it('throws when updating non-existing record', () => {
    expect(() => storage.update({ id: 'missing', tags: [] }))
      .toThrow('Record with id \'missing\' not found');
  });

  it('checks existence', () => {
    storage.add({ id: 'exist-id', tags: [] });
    expect(storage.exists('exist-id')).toBe(true);
    expect(storage.exists('not-found')).toBe(false);
  });

  it('clears all records', () => {
    storage.add({ id: '1', tags: ['a'] });
    storage.add({ id: '2', tags: ['b'] });
    storage.clear();

    expect(storage.size()).toBe(0);
  });

  it('validates incorrect record inputs', () => {
    expect(() => storage.add({ id: '', tags: [] })).toThrow(StorageError);
    expect(() => storage.add({ id: 'ok', tags: ['a', 123] } as Record)).toThrow(StorageError);
  });

  it('validates incorrect query criteria', () => {
    expect(() => storage.query({ id: '', tags: [] })).toThrow(StorageError);
    expect(() => storage.query({ tags: [null] } as unknown as QueryCriteria)).toThrow(StorageError);
  });

  it('returns deep copies of records (immutability check)', () => {
    storage.add({ id: 'immutable', tags: ['tag'] });

    const result = storage.query({ id: 'immutable' });
    result[0].tags.push('new'); // try to mutate

    const original = storage.query({ id: 'immutable' })[0];
    expect(original.tags).not.toContain('new');
  });
});
