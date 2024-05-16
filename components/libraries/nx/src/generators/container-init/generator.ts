import { formatFiles, ProjectConfiguration, readNxJson, Tree, updateJson, updateNxJson } from '@nx/devkit';
import { join } from 'path';
import { ContainerInitGeneratorSchema } from './schema';

export async function containerInitGenerator(tree: Tree, options: ContainerInitGeneratorSchema) {
  const nxJson = readNxJson(tree);
  nxJson.targetDefaults['@nx-tools/nx-container:build'] = {
    ...(nxJson.targetDefaults['@nx-tools/nx-container:build'] ?? {}),
    cache: false,
    dependsOn: [
      ...new Set(['ncc', 'server', ...(nxJson.targetDefaults['@nx-tools/nx-container:build']?.dependsOn ?? [])])
    ]
  };
  updateNxJson(tree, nxJson);

  updateJson<ProjectConfiguration, ProjectConfiguration>(tree, join(options.root, 'project.json'), (projectConfig) => {
    projectConfig.targets = {
      ...projectConfig.targets,
      container: {
        executor: '@nx-tools/nx-container:build',
        defaultConfiguration: 'development',
        configurations: {
          development: {
            quiet: true,
            load: true,
            push: false,
            tags: [`${options.name}:local`]
          },
          production: {
            quiet: true,
            load: false,
            push: true,
            metadata: {
              images: [`docker.io/bonsquare/${options.name}`],
              tags: ['type=ref,event=branch', 'type=semver,pattern={{major}}.{{minor}}']
            }
          }
        }
      }
    };
    return projectConfig;
  });

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export default containerInitGenerator;
