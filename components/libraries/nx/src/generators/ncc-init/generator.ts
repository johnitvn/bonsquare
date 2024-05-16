import { formatFiles, ProjectConfiguration, readNxJson, Tree, updateJson, updateNxJson } from '@nx/devkit';
import { join } from 'path';
import { NccInitGeneratorSchema } from './schema';

export async function nccInitGenerator(tree: Tree, options: NccInitGeneratorSchema) {
  const nxJson = readNxJson(tree);
  nxJson.targetDefaults['@bonsquare/nx:ncc'] = {
    ...(nxJson.targetDefaults['@bonsquare/nx:ncc'] ?? {}),
    cache: true
  };
  updateNxJson(tree, nxJson);

  updateJson<ProjectConfiguration, ProjectConfiguration>(tree, join(options.root, 'project.json'), (projectConfig) => {
    projectConfig.targets = {
      ...projectConfig.targets,
      ncc: {
        executor: '@bonsquare/nx:ncc',
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'development',
        options: {
          outputPath: `dist/${options.root}/ncc`,
          buildTarget: `${options.name}:build`
        },
        configurations: {
          development: {
            buildTarget: `${options.name}:build:development`
          },
          production: {
            buildTarget: `${options.name}:build:production`
          }
        }
      },
      'ncc-serve': {
        executor: '@nx/js:node',
        defaultConfiguration: 'development',
        options: {
          runBuildTargetDependencies: true,
          buildTarget: `${options.name}:ncc`
        },
        configurations: {
          development: {
            buildTarget: `${options.name}:ncc:development`
          },
          production: {
            buildTarget: `${options.name}:ncc:production`
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

export default nccInitGenerator;
