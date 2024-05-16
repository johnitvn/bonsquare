import { Tree, formatFiles, readNxJson, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { join } from 'path';
import { dockerComposeInitGenerator } from './generator'; // Replace 'yourFile' with the actual file name where your function is defined

// Mock dependencies
jest.mock('@nx/devkit', () => ({
  readNxJson: jest.fn(),
  updateJson: jest.fn(),
  updateNxJson: jest.fn(),
  formatFiles: jest.fn().mockResolvedValue(undefined) // Mock formatFiles to return a resolved promise
}));

describe('dockerComposeInitGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    // Initialize the tree
    tree = createTreeWithEmptyWorkspace();
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.clearAllMocks();
  });

  it('should update project configuration with correct targets', async () => {
    // Call the function
    await dockerComposeInitGenerator(tree, {
      name: 'mockProject',
      root: '/project-root',
      skipFormat: false
    });

    // Assert
    expect(updateJson).toHaveBeenCalledWith(
      expect.any(Object),
      join('/project-root', 'project.json'),
      expect.any(Function)
    );
  });

  it('should write compose.yaml file', async () => {
    // Call the function
    await dockerComposeInitGenerator(tree, {
      name: 'mockProject',
      root: '/project-root',
      skipFormat: false
    });

    // Assert that compose.yaml file is written
    expect(tree.read(join('/project-root', 'compose.yaml'), 'utf-8').trim()).toBe('');
  });

  it('should call formatFiles if skipFormat is false', async () => {
    // Mock readNxJson to return a mock NxJson
    (readNxJson as jest.Mock).mockReturnValue({ targetDefaults: {} });

    // Call the function with skipFormat set to false
    await dockerComposeInitGenerator(tree, {
      name: 'mockProject',
      root: '/project-root',
      skipFormat: false
    });

    // Assert
    expect(formatFiles).toHaveBeenCalled();
  });

  it('should not call formatFiles if skipFormat is true', async () => {
    // Mock readNxJson to return a mock NxJson
    (readNxJson as jest.Mock).mockReturnValue({ targetDefaults: {} });

    // Call the function with skipFormat set to true
    await dockerComposeInitGenerator(tree, {
      name: 'mockProject',
      root: '/project-root',
      skipFormat: true
    });

    // Assert
    expect(formatFiles).not.toHaveBeenCalled();
  });
});
