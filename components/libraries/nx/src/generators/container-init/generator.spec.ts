import { Tree, formatFiles, readNxJson, updateJson, updateNxJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { join } from 'path';
import { containerInitGenerator } from './generator'; // Replace 'yourFile' with the actual file name where your function is defined

// Mock dependencies
jest.mock('@nx/devkit', () => ({
  readNxJson: jest.fn(),
  updateJson: jest.fn(),
  updateNxJson: jest.fn(),
  formatFiles: jest.fn().mockResolvedValue(undefined) // Mock formatFiles to return a resolved promise
}));

describe('containerInitGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    // Initialize the tree
    tree = createTreeWithEmptyWorkspace();
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.clearAllMocks();
  });

  it('should update nxJson with correct target defaults', async () => {
    // Mock readNxJson to return a mock NxJson
    (readNxJson as jest.Mock).mockReturnValue({ targetDefaults: {} });

    // Call the function
    await containerInitGenerator(tree, {
      name: 'mockProject',
      root: '/project-root',
      skipFormat: false
    });

    // Assert
    expect(updateNxJson).toHaveBeenCalledWith(expect.any(Object), {
      targetDefaults: {
        '@nx-tools/nx-container:build': {
          cache: false,
          dependsOn: ['ncc', 'server']
        }
      }
    });
  });

  it('should update project configuration with correct targets', async () => {
    // Mock readNxJson to return a mock NxJson
    (readNxJson as jest.Mock).mockReturnValue({ targetDefaults: {} });

    // Call the function
    await containerInitGenerator(tree, {
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

  it('should call formatFiles if skipFormat is false', async () => {
    // Mock readNxJson to return a mock NxJson
    (readNxJson as jest.Mock).mockReturnValue({ targetDefaults: {} });

    // Call the function with skipFormat set to false
    await containerInitGenerator(tree, {
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
    await containerInitGenerator(tree, {
      name: 'mockProject',
      root: '/project-root',
      skipFormat: true
    });

    // Assert
    expect(formatFiles).not.toHaveBeenCalled();
  });
});
