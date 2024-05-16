import { ProjectConfiguration, Tree, formatFiles, generateFiles, updateJson } from '@nx/devkit';
import { logShowProjectCommand } from '@nx/devkit/src/utils/log-show-project-command';
import { applicationGenerator } from '@nx/nest';
import { join } from 'path';
import { findNextPort } from '../../utils/find-next-port';
import containerInitGenerator from '../container-init/generator';
import dockerComposeInitGenerator from '../docker-compose-init/generator';
import nccInitGenerator from '../ncc-init/generator';
import protoLibraryGenerator from '../proto-library/generator';
import { MicroserviceGeneratorSchema } from './schema';

export async function microserviceGenerator(tree: Tree, options: MicroserviceGeneratorSchema) {
  const name = options.name;
  const root = `apps/microservices/${options.name}`;
  const port = await findNextPort();
  const substitutions = {
    name,
    root,
    port
  };

  tree.write(join(root, '.env'), `PORT=${port}\nLOG=verbose\n`);

  await protoLibraryGenerator(tree, {
    serviceName: name,
    skipFormat: true
  });

  await applicationGenerator(tree, {
    name: name,
    directory: root,
    e2eTestRunner: 'jest',
    projectNameAndRootFormat: 'as-provided',
    skipFormat: true
  });
  tree.delete(join(root, 'src', 'app', 'app.service.ts'));
  tree.delete(join(root, 'src', 'app', 'app.service.spec.ts'));

  await nccInitGenerator(tree, {
    name,
    root,
    skipFormat: true
  });

  await containerInitGenerator(tree, {
    name,
    root,
    skipFormat: true
  });

  await dockerComposeInitGenerator(tree, {
    name,
    root,
    skipFormat: true
  });

  updateJson<ProjectConfiguration, ProjectConfiguration>(tree, join(root, 'project.json'), (projectConfig) => {
    projectConfig.targets = {
      ...projectConfig.targets,
      serve: {
        dependsOn: ['^start'],
        ...projectConfig.targets.serve,
        options: {
          ...projectConfig.targets.serve.options,
          inspect: false
        }
      },
      lint: {
        executor: '@nx/eslint:lint'
      }
    };

    projectConfig.targets.build.options.assets = [
      ...projectConfig.targets.build.options.assets,
      {
        input: `libs/microservices/${options.name}-proto`,
        glob: '**/*.proto',
        output: '/assets/'
      }
    ];
    return projectConfig;
  });
  tree.delete(join(root, 'src', 'assets', '.gitkeep'));
  generateFiles(tree, join(__dirname, 'files', 'main-project'), root, substitutions);
  generateFiles(tree, join(__dirname, 'files', 'e2e-project'), root + '-e2e', substitutions);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return () => {
    logShowProjectCommand(options.name);
  };
}

export default microserviceGenerator;
