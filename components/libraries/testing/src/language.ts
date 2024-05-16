import { SYSTEM_LANGUAGE_DEFAULT } from '@bonsquare/languages';
import { workspaceRoot } from '@nx/devkit';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Get translations for a specified project and language.
 * @param {string} project - The name of the project to get translations for.
 * @param {string} [language=SYSTEM_LANGUAGE_DEFAULT] - The language to get translations for, defaults to SYSTEM_LANGUAGE_DEFAULT.
 * @returns {object} The translations object for the specified project and language.
 */
export function getTranslations(project: string, language: string = SYSTEM_LANGUAGE_DEFAULT): { [key: string]: any } {
  return JSON.parse(
    readFileSync(join(workspaceRoot, `components/languages/translations/${project}/${language}.json`), 'utf-8')
  );
}
