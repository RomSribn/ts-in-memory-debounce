/**
 * A single record stored in the in-memory storage.
 */
export interface Record {
  /**
   * Unique identifier of the record.
   */
  id: string;

  /**
   * List of case-sensitive tags associated with the record.
   */
  tags: string[];
}

/**
 * Criteria used to filter records from storage.
 */
export interface QueryCriteria {
  /**
   * Optional filter by exact id.
   */
  id?: string;

  /**
   * Optional filter by required tags (AND condition).
   * If empty array or undefined — returns all records.
   */
  tags?: string[];
}

/**
 * Generic interface for storage operations.
 */
export interface Storage {
  /**
   * Adds a new record to the storage.
   * Throws an error if the `id` already exists.
   *
   * @param record - The record to add.
   */
  add(record: Record): void;

  /**
   * Queries records by optional criteria (id and/or tags).
   *
   * @param criteria - Object containing id or tags to match.
   * @returns Array of matched records.
   */
  query(criteria?: QueryCriteria): Record[];
}