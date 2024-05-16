import { ProjectConfiguration, Tree, getProjects } from '@nx/devkit';

export function getProjectConfiguration(tree: Tree, projectName: string): ProjectConfiguration {
  const projectConfigs = getProjects(tree)[projectName];
  if (!projectConfigs) {
    throw new Error(`Project ${projectName} is not found`);
  } else {
    return projectConfigs;
  }
}
