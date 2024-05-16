import { exec, getExecOutput } from '@actions/exec';
import checkbox from '@inquirer/checkbox';
import { Tree, addProjectConfiguration, formatFiles } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import dockerComposeInitGenerator from '../docker-compose-init/generator';
import { externalServiceGenerator } from './generator';

jest.mock('@actions/exec');
jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  addProjectConfiguration: jest.fn(),
  updateJson: jest.fn(),
  formatFiles: jest.fn().mockResolvedValue(undefined),
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));
jest.mock('@inquirer/checkbox');
jest.mock('../docker-compose-init/generator');

describe('externalServiceGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pull image from registry', async () => {
    const options = {
      name: 'test-service',
      image: 'test-image:latest',
      skipFormat: false
    };
    try {
      await externalServiceGenerator(tree, options);
    } catch (err) {
      /* empty */
    } finally {
      expect(exec).toHaveBeenCalledWith(`docker pull ${options.image}`);
    }
  });

  it('should handle errors when pulling image', async () => {
    const options = {
      name: 'test-service',
      image: 'test-image:latest',
      skipFormat: false
    };
    (exec as jest.Mock).mockRejectedValueOnce(new Error('Pull error'));
    await expect(externalServiceGenerator(tree, options)).rejects.toThrowError('Pull error');
  });

  it('should promt about environment and ports', async () => {
    const options = {
      name: 'test-service',
      image: 'test-image:latest',
      skipFormat: false
    };
    (getExecOutput as jest.Mock).mockResolvedValueOnce({
      stdout: JSON.stringify([
        {
          Config: {
            ExposedPorts: { '80/tcp': {}, '443/tcp': {} },
            Env: ['NODE_ENV=production', 'DB_HOST=localhost']
          }
        }
      ])
    });
    (checkbox as jest.Mock).mockResolvedValueOnce(['NODE_ENV=production']);
    (checkbox as jest.Mock).mockResolvedValueOnce(['80/tcp']);

    // Call the function
    await externalServiceGenerator(tree, options);

    // Assets
    expect(checkbox).toHaveBeenNthCalledWith(1, {
      message: 'Select environment variables you want to use',
      choices: ['NODE_ENV=production', 'DB_HOST=localhost'].map((env) => ({
        name: ` ${env}`,
        value: env
      }))
    });
    expect(checkbox).toHaveBeenNthCalledWith(2, {
      message: 'Select environment variables you want to use',
      choices: ['80/tcp', '443/tcp'].map((port) => ({
        name: ` ${port}`,
        value: port
      }))
    });
  });

  it('should generate Docker Compose file', async () => {
    const options = {
      name: 'test-service',
      image: 'test-image:latest',
      skipFormat: false
    };
    (getExecOutput as jest.Mock).mockResolvedValueOnce({
      stdout: JSON.stringify([
        {
          Config: {
            ExposedPorts: { '80/tcp': {}, '443/tcp': {} },
            Env: ['NODE_ENV=production', 'DB_HOST=localhost']
          }
        }
      ])
    });
    (checkbox as jest.Mock).mockResolvedValueOnce(['NODE_ENV=production']);
    (checkbox as jest.Mock).mockResolvedValueOnce(['80/tcp']);

    // Call the functions
    await externalServiceGenerator(tree, options);

    // Assert
    expect(tree.exists('components/external-services/test-service/compose.yaml')).toBeTruthy();
  });

  it('should init docker compose targets', async () => {
    const options = {
      name: 'test-service',
      image: 'test-image:latest',
      skipFormat: false
    };
    (getExecOutput as jest.Mock).mockResolvedValueOnce({
      stdout: JSON.stringify([
        {
          Config: {
            ExposedPorts: { '80/tcp': {}, '443/tcp': {} },
            Env: ['NODE_ENV=production', 'DB_HOST=localhost']
          }
        }
      ])
    });
    (checkbox as jest.Mock).mockResolvedValueOnce(['NODE_ENV=production']);
    (checkbox as jest.Mock).mockResolvedValueOnce(['80/tcp']);

    // Call the functions
    await externalServiceGenerator(tree, options);

    // Assert
    expect(dockerComposeInitGenerator).toHaveBeenCalledWith(tree, {
      name: options.name,
      root: `components/external-services/${options.name}`,
      skipFormat: true
    });
  });

  it('should add project configuration', async () => {
    const options = {
      name: 'test-service',
      image: 'test-image:latest',
      skipFormat: false
    };
    (getExecOutput as jest.Mock).mockResolvedValueOnce({
      stdout: JSON.stringify([
        {
          Config: {
            ExposedPorts: { '80/tcp': {}, '443/tcp': {} },
            Env: ['NODE_ENV=production', 'DB_HOST=localhost']
          }
        }
      ])
    });
    (checkbox as jest.Mock).mockResolvedValueOnce(['NODE_ENV=production']);
    (checkbox as jest.Mock).mockResolvedValueOnce(['80/tcp']);
    await externalServiceGenerator(tree, options);
    expect(addProjectConfiguration).toHaveBeenCalledWith(tree, options.name, {
      root: `components/external-services/${options.name}`,
      sourceRoot: `components/external-services/${options.name}`,
      projectType: 'application'
    });
  });

  it('should handle errors when inspecting image', async () => {
    const options = {
      name: 'test-service',
      image: 'test-image:latest',
      skipFormat: false
    };
    (getExecOutput as jest.Mock).mockRejectedValueOnce(new Error('Inspect error'));
    await expect(externalServiceGenerator(tree, options)).rejects.toThrowError('Inspect error');
  });

  it('should handle errors when generating Docker Compose file', async () => {
    const options = {
      name: 'test-service',
      image: 'test-image:latest',
      skipFormat: false
    };
    (getExecOutput as jest.Mock).mockResolvedValueOnce({
      stdout: JSON.stringify([
        {
          Config: {
            ExposedPorts: { '80/tcp': {}, '443/tcp': {} },
            Env: ['NODE_ENV=production', 'DB_HOST=localhost']
          }
        }
      ])
    });
    (checkbox as jest.Mock).mockRejectedValueOnce(new Error('Checkbox error'));
    await expect(externalServiceGenerator(tree, options)).rejects.toThrowError('Checkbox error');
  });

  it('should call formatFiles if skipFormat is false', async () => {
    const options = {
      name: 'test-service',
      image: 'test-image:latest',
      skipFormat: false
    };
    (getExecOutput as jest.Mock).mockResolvedValueOnce({
      stdout: JSON.stringify([
        {
          Config: {
            ExposedPorts: { '80/tcp': {}, '443/tcp': {} },
            Env: ['NODE_ENV=production', 'DB_HOST=localhost']
          }
        }
      ])
    });
    (checkbox as jest.Mock).mockResolvedValueOnce(['NODE_ENV=production']);
    (checkbox as jest.Mock).mockResolvedValueOnce(['80/tcp']);
    await externalServiceGenerator(tree, options);
    expect(formatFiles).toHaveBeenCalled();
  });

  it('should not call formatFiles if skipFormat is true', async () => {
    const options = {
      name: 'test-service',
      image: 'test-image:latest',
      skipFormat: true
    };
    (getExecOutput as jest.Mock).mockResolvedValueOnce({
      stdout: JSON.stringify([
        {
          Config: {
            ExposedPorts: { '80/tcp': {}, '443/tcp': {} },
            Env: ['NODE_ENV=production', 'DB_HOST=localhost']
          }
        }
      ])
    });
    (checkbox as jest.Mock).mockResolvedValueOnce(['NODE_ENV=production']);
    (checkbox as jest.Mock).mockResolvedValueOnce(['80/tcp']);
    await externalServiceGenerator(tree, options);
    expect(formatFiles).not.toHaveBeenCalled();
  });
});
