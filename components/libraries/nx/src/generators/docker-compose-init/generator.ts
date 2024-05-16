import { formatFiles, ProjectConfiguration, Tree, updateJson } from '@nx/devkit';
import { join } from 'path';
import { DockerComposeInitGeneratorSchema } from './schema';

export async function dockerComposeInitGenerator(tree: Tree, options: DockerComposeInitGeneratorSchema) {
  updateJson<ProjectConfiguration, ProjectConfiguration>(tree, join(options.root, 'project.json'), (projectConfig) => {
    projectConfig.targets = {
      ...projectConfig.targets,
      start: {
        dependsOn: ['container', '^start'],
        executor: 'nx:run-commands',
        options: {
          command: `docker compose -f ${options.root}/compose.yaml up -d --wait --remove-orphans`
        }
      },
      stop: {
        dependsOn: ['^stop'],
        executor: 'nx:run-commands',
        options: {
          command: `docker compose -f ${options.root}/compose.yaml down`
        }
      }
    };
    return projectConfig;
  });

  tree.write(join(options.root, 'compose.yaml'), '');

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export default dockerComposeInitGenerator;
