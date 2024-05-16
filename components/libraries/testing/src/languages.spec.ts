import { SYSTEM_LANGUAGE_DEFAULT } from '@bonsquare/languages';
import { workspaceRoot } from '@nx/devkit';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getTranslations } from './language';

// Mock the dependencies
jest.mock('fs');
jest.mock('path');
jest.mock('@nx/devkit', () => ({
  workspaceRoot: '/mocked/workspace/root'
}));

describe('getTranslations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return translations for the specified project and language', () => {
    const project = 'testProject';
    const language = 'en';
    const mockedFilePath = '/mocked/workspace/root/components/languages/translations/testProject/en.json';
    const mockedFileContent = JSON.stringify({ key: 'value' });

    (join as jest.Mock).mockReturnValue(mockedFilePath);
    (readFileSync as jest.Mock).mockReturnValue(mockedFileContent);

    const translations = getTranslations(project, language);
    expect(join).toHaveBeenCalledWith(workspaceRoot, `components/languages/translations/${project}/${language}.json`);
    expect(readFileSync).toHaveBeenCalledWith(mockedFilePath, 'utf-8');
    expect(translations).toEqual({ key: 'value' });
  });

  it('should use default language if not specified', () => {
    const project = 'testProject';
    const mockedFilePath = `/mocked/workspace/root/components/languages/translations/testProject/${SYSTEM_LANGUAGE_DEFAULT}.json`;
    const mockedFileContent = JSON.stringify({ key: 'default_value' });

    (join as jest.Mock).mockReturnValue(mockedFilePath);
    (readFileSync as jest.Mock).mockReturnValue(mockedFileContent);

    const translations = getTranslations(project);
    expect(join).toHaveBeenCalledWith(
      workspaceRoot,
      `components/languages/translations/${project}/${SYSTEM_LANGUAGE_DEFAULT}.json`
    );
    expect(readFileSync).toHaveBeenCalledWith(mockedFilePath, 'utf-8');
    expect(translations).toEqual({ key: 'default_value' });
  });

  it('should throw an error if the file does not exist', () => {
    const project = 'testProject';
    const language = 'en';
    const mockedFilePath = `/mocked/workspace/root/components/languages/translations/testProject/${language}.json`;

    (join as jest.Mock).mockReturnValue(mockedFilePath);
    (readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() => getTranslations(project, language)).toThrow('File not found');
  });
});
