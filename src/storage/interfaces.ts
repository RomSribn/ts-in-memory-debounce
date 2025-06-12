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

  /**
   * Removes a record by id.
   *
   * @param id - The id of the record to remove.
   * @returns true if record was removed, false if not found.
   */
  remove(id: string): boolean;

  /**
   * Updates an existing record.
   *
   * @param record - The updated record.
   * @throws Error when record doesn't exist or is invalid.
   */
  update(record: Record): void;

  /**
   * Checks if a record exists.
   *
   * @param id - The id to check.
   * @returns true if record exists, false otherwise.
   */
  exists(id: string): boolean;

  /**
   * Returns the number of records in storage.
   *
   * @returns The count of records.
   */
  size(): number;

  /**
   * Removes all records from storage.
   */
  clear(): void;
}
