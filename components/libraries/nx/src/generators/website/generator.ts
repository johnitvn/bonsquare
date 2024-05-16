import { E2eTestRunner, host } from '@nx/angular/generators';
import { ProjectConfiguration, Tree, formatFiles, generateFiles, updateJson } from '@nx/devkit';
import { logShowProjectCommand } from '@nx/devkit/src/utils/log-show-project-command';
import { join } from 'path';
import { findNextPort } from '../../utils/find-next-port';
import { WebsiteGeneratorSchema } from './schema';

export async function websiteGenerator(tree: Tree, options: WebsiteGeneratorSchema) {
  const projectRoot = `components/websites/${options.name}`;
  const port = await findNextPort();

  await host(tree, {
    name: options.name,
    directory: projectRoot,
    projectNameAndRootFormat: 'as-provided',
    dynamic: true,
    ssr: true,
    addTailwind: true,
    style: 'scss',
    standalone: true,
    inlineStyle: true,
    e2eTestRunner: E2eTestRunner.Playwright,
    prefix: options.name.slice(0, options.name.lastIndexOf('-')),
    skipFormat: true
  });

  updateJson<ProjectConfiguration, ProjectConfiguration>(tree, join(projectRoot, 'project.json'), (projectConfig) => {
    projectConfig.targets = {
      ...projectConfig.targets,
      serve: {
        ...projectConfig.targets.serve,
        dependsOn: ['^start', 'stop'],
        options: {
          ...projectConfig.targets.serve.options,
          port
        }
      },
      'serve-ssr': {
        ...projectConfig.targets['serve-ssr'],
        dependsOn: ['^start'],
        options: {
          ...projectConfig.targets['serve-ssr'].options,
          port
        }
      },
      lint: {
        executor: '@nx/eslint:lint'
      }
    };
    return projectConfig;
  });

  const tsConfigs = ['tsconfig.app.json', 'tsconfig.server.json'];
  tsConfigs.forEach((file) => {
    updateJson(tree, join(projectRoot, file), (tsConfig) => {
      tsConfig.compilerOptions.target = 'ES2022';
      return tsConfig;
    });
  });

  const substitutions = { ...options, port };
  generateFiles(tree, join(__dirname, 'files'), projectRoot, substitutions);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return () => {
    logShowProjectCommand(options.name);
  };
}

export default websiteGenerator;
