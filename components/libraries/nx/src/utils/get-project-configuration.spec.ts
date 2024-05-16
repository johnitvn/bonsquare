import { Tree, getProjects } from '@nx/devkit';
import { getProjectConfiguration } from './get-project-configuration'; // Mocking the getProjects function from '@nx/devkit'
jest.mock('@nx/devkit', () => ({
  getProjects: jest.fn()
}));

describe('getProjectConfiguration', () => {
  let tree: Tree;

  beforeEach(() => {
    // Initialize the tree
    tree = {} as Tree;
  });

  it('should return project configuration if project exists', () => {
    // Mocking the project configuration
    const projectName = 'yourProjectName'; // Replace 'yourProjectName' with the actual project name
    const projectConfig = { projectName: 'Your project configuration' };
    (getProjects as jest.Mock).mockReturnValue({
      [projectName]: projectConfig
    });

    // Call the function
    const result = getProjectConfiguration(tree, projectName);

    // Assert
    expect(result).toEqual(projectConfig);
  });

  it('should throw an error if project does not exist', () => {
    // Mocking an empty projects object
    (getProjects as jest.Mock).mockReturnValue({});

    // Call the function with a non-existent project name
    const projectName = 'nonExistentProjectName';
    expect(() => getProjectConfiguration(tree, projectName)).toThrow(`Project ${projectName} is not found`);
  });
});
