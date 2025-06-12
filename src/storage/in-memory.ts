import { Record, QueryCriteria, Storage } from './interfaces';

/**
 * Custom error class for storage operations.
 */
export class StorageError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * In-memory implementation of a simple record storage.
 * Supports basic filtering by id and tags with comprehensive validation.
 */
export class InMemoryStorage implements Storage {
  private readonly records = new Map<string, Record>();

  /**
   * Adds a new record to the store.
   * Throws an error if the id already exists or record is invalid.
   *
   * @param record - The record to be added.
   * @throws StorageError when id already exists or record is invalid.
   */
  add(record: Record): void {
    this.validateRecord(record);
    
    if (this.records.has(record.id)) {
      throw new StorageError(`Record with id '${record.id}' already exists`, 'DUPLICATE_ID');
    }
    
    // Create a deep copy to prevent external mutations
    const recordCopy: Record = {
      id: record.id,
      tags: [...record.tags]
    };
    
    this.records.set(record.id, recordCopy);
  }

  /**
   * Returns all records that match the provided criteria.
   * If no criteria or empty `tags` array is passed, all records are returned.
   *
   * @param criteria - Optional filtering object by id and/or tags.
   * @returns Array of matched records (deep copies).
   */
  query(criteria?: QueryCriteria): Record[] {
    if (criteria) {
      this.validateQueryCriteria(criteria);
    }

    if (!criteria || (!criteria.id && !criteria.tags)) {
      return this.getAllRecords();
    }

    const results: Record[] = [];
    for (const record of this.records.values()) {
      if (this.matchesCriteria(record, criteria)) {
        results.push(this.copyRecord(record));
      }
    }
    
    return results;
  }

  /**
   * Removes a record by id.
   *
   * @param id - The id of the record to remove.
   * @returns true if record was removed, false if not found.
   */
  remove(id: string): boolean {
    if (!id || typeof id !== 'string' || !id.trim()) {
      throw new StorageError('Invalid id: must be a non-empty string', 'INVALID_ID');
    }
    return this.records.delete(id);
  }

  /**
   * Updates an existing record.
   *
   * @param record - The updated record.
   * @throws StorageError when record doesn't exist or is invalid.
   */
  update(record: Record): void {
    this.validateRecord(record);
    
    if (!this.records.has(record.id)) {
      throw new StorageError(`Record with id '${record.id}' not found`, 'RECORD_NOT_FOUND');
    }
    
    const recordCopy: Record = {
      id: record.id,
      tags: [...record.tags]
    };
    
    this.records.set(record.id, recordCopy);
  }

  /**
   * Checks if a record exists.
   *
   * @param id - The id to check.
   * @returns true if record exists, false otherwise.
   */
  exists(id: string): boolean {
    if (!id || typeof id !== 'string') {
      return false;
    }
    return this.records.has(id);
  }

  /**
   * Returns the number of records in storage.
   *
   * @returns The count of records.
   */
  size(): number {
    return this.records.size;
  }

  /**
   * Removes all records from storage.
   */
  clear(): void {
    this.records.clear();
  }

  private validateRecord(record: Record): void {
    if (!record || typeof record !== 'object') {
      throw new StorageError('Invalid record: must be an object', 'INVALID_RECORD');
    }
    
    if (!record.id || typeof record.id !== 'string' || !record.id.trim()) {
      throw new StorageError('Invalid record: id must be a non-empty string', 'INVALID_ID');
    }
    
    if (!Array.isArray(record.tags)) {
      throw new StorageError('Invalid record: tags must be an array', 'INVALID_TAGS');
    }
    
    // Validate that all tags are strings
    for (let i = 0; i < record.tags.length; i++) {
      if (typeof record.tags[i] !== 'string') {
        throw new StorageError(`Invalid record: tag at index ${i} must be a string`, 'INVALID_TAG_TYPE');
      }
    }
  }

  private validateQueryCriteria(criteria: QueryCriteria): void {
    if (criteria.id !== undefined && (typeof criteria.id !== 'string' || !criteria.id.trim())) {
      throw new StorageError('Invalid criteria: id must be a non-empty string', 'INVALID_CRITERIA_ID');
    }
    
    if (criteria.tags !== undefined) {
      if (!Array.isArray(criteria.tags)) {
        throw new StorageError('Invalid criteria: tags must be an array', 'INVALID_CRITERIA_TAGS');
      }
      
      for (let i = 0; i < criteria.tags.length; i++) {
        if (typeof criteria.tags[i] !== 'string') {
          throw new StorageError(`Invalid criteria: tag at index ${i} must be a string`, 'INVALID_CRITERIA_TAG_TYPE');
        }
      }
    }
  }

  private matchesCriteria(record: Record, criteria: QueryCriteria): boolean {
    const idMatch = !criteria.id || record.id === criteria.id;
    const tagsMatch = !criteria.tags || criteria.tags.length === 0 ||
      criteria.tags.every(tag => record.tags.includes(tag));
    return idMatch && tagsMatch;
  }

  private getAllRecords(): Record[] {
    const results: Record[] = [];
    for (const record of this.records.values()) {
      results.push(this.copyRecord(record));
    }
    return results;
  }

  private copyRecord(record: Record): Record {
    return {
      id: record.id,
      tags: [...record.tags]
    };
  }
}
