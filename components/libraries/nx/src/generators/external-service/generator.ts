import { exec, getExecOutput } from '@actions/exec';
import checkbox from '@inquirer/checkbox';
import { Tree, addProjectConfiguration, formatFiles, logger } from '@nx/devkit';
import { logShowProjectCommand } from '@nx/devkit/src/utils/log-show-project-command';
import { red } from 'chalk';
import { join } from 'path';
import { stringify } from 'yaml';
import dockerComposeInitGenerator from '../docker-compose-init/generator';
import { ExternalServiceGeneratorSchema } from './schema';

export async function externalServiceGenerator(tree: Tree, options: ExternalServiceGeneratorSchema) {
  try {
    await exec(`docker pull ${options.image}`);
  } catch (err) {
    logger.error(red('Error while pull image'));
    throw err;
  }

  let environments, exposedPorts;
  try {
    const { stdout } = await getExecOutput(`docker inspect --format json --type image ${options.image}`, undefined, {
      silent: true
    });
    const imageInfo = JSON.parse(stdout)[0];
    environments = imageInfo.Config.Env;
    exposedPorts = imageInfo.Config.ExposedPorts;
    logger.log({ environments, exposedPorts });
  } catch (err) {
    logger.warn(red('Error while inspect image'));
    throw err;
  }

  let usingEnvironments;
  if (environments && environments.length > 0) {
    usingEnvironments = await checkbox({
      message: 'Select environment variables you want to use',
      choices: environments.map((env) => ({ name: ` ${env}`, value: env }))
    });
  }

  let usingPublicPorts;
  if (exposedPorts && Object.keys(exposedPorts).length > 0) {
    usingPublicPorts = await checkbox({
      message: 'Select environment variables you want to use',
      choices: Object.keys(exposedPorts).map((port) => ({
        name: ` ${port}`,
        value: port
      }))
    });
  }

  const compose = { services: {} };
  compose.services[options.name] = {
    container_name: options.name,
    image: options.image
  };

  if (usingPublicPorts) {
    usingPublicPorts.map((portSchema) => {
      const [port, protocol] = portSchema.split('/');
      compose.services[options.name]['ports'] = [
        ...(compose.services[options.name]['ports'] ?? []),
        `${port}:${port}/${protocol}`
      ];
    });
  }

  if (usingEnvironments) {
    usingEnvironments.map((variable) => {
      compose.services[options.name]['enviroment'] = [
        ...(compose.services[options.name]['enviroment'] ?? []),
        `${variable}=`
      ];
    });
  }

  const name = options.name;
  const root = `components/external-services/${options.name}`;
  tree.write(join(root, 'compose.yaml'), stringify(compose));
  addProjectConfiguration(tree, options.name, {
    root: root,
    sourceRoot: root,
    projectType: 'application'
  });

  await dockerComposeInitGenerator(tree, {
    name,
    root,
    skipFormat: true
  });

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return () => {
    logShowProjectCommand(options.name);
  };
}

export default externalServiceGenerator;
