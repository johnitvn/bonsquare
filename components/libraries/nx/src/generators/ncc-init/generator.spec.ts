/* eslint-disable @typescript-eslint/no-var-requires */
import { Tree, formatFiles, readNxJson, updateJson, updateNxJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { join } from 'path';
import { nccInitGenerator } from './generator';

jest.mock('@nx/devkit', () => ({
  readNxJson: jest.fn(),
  updateJson: jest.fn(),
  updateNxJson: jest.fn(),
  formatFiles: jest.fn().mockResolvedValue(undefined) // Mock formatFiles to return a resolved promise
}));

describe('nccGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    // Initialize the tree
    tree = createTreeWithEmptyWorkspace();
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.clearAllMocks();
  });

  it('should update nxJson with cache option', async () => {
    // Mock readNxJson to return a mock NxJson
    (readNxJson as jest.Mock).mockReturnValue({ targetDefaults: {} });

    // Call the function
    await nccInitGenerator(tree, {
      name: 'mockProject',
      root: '/project-root',
      skipFormat: false
    });

    // Assert
    expect(updateNxJson).toHaveBeenCalledWith(expect.any(Object), {
      targetDefaults: {
        '@bonsquare/nx:ncc': { cache: true }
      }
    });
  });

  it('should update project configuration with correct targets', async () => {
    // Mock readNxJson to return a mock NxJson
    (readNxJson as jest.Mock).mockReturnValue({ targetDefaults: {} });

    // Call the function
    await nccInitGenerator(tree, {
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
    await nccInitGenerator(tree, {
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
    await nccInitGenerator(tree, {
      name: 'mockProject',
      root: '/project-root',
      skipFormat: true
    });

    // Assert
    expect(formatFiles).not.toHaveBeenCalled();
  });
});
