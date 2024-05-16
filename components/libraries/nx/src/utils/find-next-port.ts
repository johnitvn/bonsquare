import { getExecOutput } from '@actions/exec';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export const findNextPort = async () => {
  const { stdout } = await getExecOutput('nx show projects --type=app --json', undefined, { silent: true });
  const projects = JSON.parse(stdout.trim());
  const userPorts = [];
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const { stdout } = await getExecOutput('nx show project ' + project, undefined, { silent: true });
    const projectConfig = JSON.parse(stdout.trim());
    const projectRoot = projectConfig.root;

    // for nestjs project
    if (existsSync(join(projectRoot, '.env'))) {
      const portEnviroment = readFileSync(join(projectRoot, '.env'), 'utf-8')
        .split('\n')
        .find((line) => line.startsWith('PORT'));

      if (portEnviroment) {
        userPorts.push(portEnviroment.split('=')[1]);
      }
    }

    // for angular project
    if (projectConfig.targets?.serve?.options?.port) {
      userPorts.push(projectConfig.targets.serve.options.port);
    }
  }
  return userPorts.length == 0 ? 50000 : Math.max(...userPorts) + 1;
};
