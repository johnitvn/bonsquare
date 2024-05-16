import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { SYSTEM_LANGUAGES, SYSTEM_LANGUAGES_MAP, SYSTEM_LANGUAGE_DEFAULT } from '.';

describe('languages', () => {
  it('SYSTEM_LANGUAGE_DEFAULT should be one of SYSTEM_LANGUAGES', () => {
    expect(SYSTEM_LANGUAGES.includes(SYSTEM_LANGUAGE_DEFAULT)).toBeTruthy();
  });

  it('SYSTEM_LANGUAGES_MAP should be have all of SYSTEM_LANGUAGES', () => {
    expect(Object.keys(SYSTEM_LANGUAGES_MAP).length === SYSTEM_LANGUAGES.length).toBeTruthy();
    expect(Object.keys(SYSTEM_LANGUAGES_MAP).every((lang) => SYSTEM_LANGUAGES.includes(lang))).toBeTruthy();
  });

  it('All translations should be have all SYSTEM_LANGUAGES', () => {
    const projects = readdirSync(join(__dirname, '../translations'));
    for (let i = 0; i < projects.length; i++) {
      const languageFiles = readdirSync(join(__dirname, '../translations', projects[i]));
      expect(SYSTEM_LANGUAGES.every((language) => languageFiles.includes(`${language}.json`)));
    }
  });

  it('All translation files within a project must contain identical keys', () => {
    const projects = readdirSync(join(__dirname, '../translations'));
    for (let i = 0; i < projects.length; i++) {
      const languageFilesContent = readdirSync(join(__dirname, '../translations', projects[i])).map((file) =>
        readJsonFile(join(__dirname, '../translations', projects[i], file))
      );
      expect(compareKeys(...languageFilesContent));
    }
  });
});

interface JsonObject {
  [key: string]: any;
}

/**
 * Recursively retrieves all keys from a JSON object.
 *
 * @param {JsonObject} obj - The JSON object to retrieve keys from.
 * @param {string} [prefix=''] - A prefix for nested keys (used for recursion).
 * @returns {Set<string>} - A set of keys from the JSON object.
 *
 * @example
 * const obj = { a: 1, b: { c: 2, d: 3 } };
 * const keys = getKeys(obj);
 * console.log(keys); // Output: Set { 'a', 'b.c', 'b.d' }
 */
function getKeys(obj: JsonObject, prefix = ''): Set<string> {
  const keys = new Set<string>();
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const key = prefix + k;
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        const childKeys = getKeys(obj[k], key + '.');
        childKeys.forEach((childKey) => keys.add(childKey));
      } else {
        keys.add(key);
      }
    }
  }
  return keys;
}

/**
 * Compares the keys of multiple JSON objects to ensure they are identical.
 *
 * @param {...JsonObject[]} jsonObjects - The JSON objects to compare.
 * @returns {boolean} - True if all JSON objects have identical keys, otherwise false.
 *
 * @example
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { a: 3, b: { c: 4 } };
 * const obj3 = { a: 5, b: { c: 6 } };
 * const result = compareKeys(obj1, obj2, obj3);
 * console.log(result); // Output: true
 */
function compareKeys(...jsonObjects: JsonObject[]): boolean {
  if (jsonObjects.length < 2) {
    throw new Error('At least two JSON objects are required to compare keys.');
  }

  const keySets = jsonObjects.map((json) => getKeys(json));
  const allKeys = new Set<string>();
  keySets.forEach((keys) => keys.forEach((key) => allKeys.add(key)));

  return keySets.every((keys) => keys.size === allKeys.size && [...keys].every((value) => allKeys.has(value)));
}

/**
 * Reads and parses the content of a JSON file.
 *
 * @param {string} filePath - The path to the JSON file.
 * @returns {JsonObject} - The parsed JSON object.
 *
 * @example
 * const jsonObj = readJsonFile('path/to/file.json');
 * console.log(jsonObj); // Output: { ... }
 */
function readJsonFile(filePath: string): JsonObject {
  const rawData = readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}
