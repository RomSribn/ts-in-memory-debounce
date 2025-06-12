import { Record, QueryCriteria, Storage } from './interfaces';

/**
 * In-memory implementation of a simple record storage.
 * Supports basic filtering by id and tags.
 */
export class InMemoryStorage implements Storage {
  private records = new Map<string, Record>();

  /**
   * Adds a new record to the store.
   * Throws an error if the id already exists.
   *
   * @param record - The record to be added.
   * @throws Error when id already exists.
   */
  add(record: Record): void {
    if (this.records.has(record.id)) {
      throw new Error(`Duplicate id: ${record.id}`);
    }
    this.records.set(record.id, record);
  }

  /**
   * Returns all records that match the provided criteria.
   * If no criteria or empty `tags` array is passed, all records are returned.
   *
   * @param criteria - Optional filtering object by id and/or tags.
   * @returns Array of matched records.
   */
  query(criteria?: QueryCriteria): Record[] {
    const values = Array.from(this.records.values());

    if (!criteria || (!criteria.id && !criteria.tags)) {
      return values;
    }

    return values.filter((r) => {
      const idMatch = !criteria.id || r.id === criteria.id;
      const tagsMatch =
        !criteria.tags || criteria.tags.length === 0 ||
        criteria.tags.every(tag => r.tags.includes(tag));
      return idMatch && tagsMatch;
    });
  }
}
