import { exec } from '@actions/exec';
import { ExecutorContext, ProjectGraphProjectNode, logger, parseTargetString, readTargetOptions } from '@nx/devkit';
import { getRelativeDirectoryToProjectRoot } from '@nx/js/src/utils/get-main-file-dir';
import * as chalk from 'chalk';
import { cpSync, renameSync } from 'fs';
import { run } from 'nx/src/command-line/run/run';
import { interpolate } from 'nx/src/tasks-runner/utils';
import { basename, join, parse } from 'path';
import * as readdirGlob from 'readdir-glob';
import { NccExecutorSchema } from './schema';

export async function nccBuild(options: NccExecutorSchema & { inputFile: string }, context: ExecutorContext) {
  const args = [`--out=${options.outputPath}`];
  if (context.isVerbose) {
    args.push('--debug');
  }
  if (options.v8Cache) {
    args.push('--v8-cache');
  }
  if (options.minify) {
    args.push('--minify');
  }
  await exec(`npx`, ['--no-install', '-p=@vercel/ncc', 'ncc', 'build', options.inputFile, ...args], {
    silent: true,
    listeners: {
      stdout(data) {
        const message = data.toString().trim();
        logger.log(message);
      },
      stderr(data) {
        logger.error(data.toString().trim());
      }
    }
  });

  if (options.outputFileName !== 'index.js') {
    renameSync(join(options.outputPath, 'index.js'), join(options.outputPath, options.outputFileName));
  }
}

async function copyAssets(assets: Array<string>, options: NccExecutorSchema) {
  if (assets && assets.length > 0) {
    for (let i = 0; i < assets.length; i++) {
      const from = assets[i];
      if (typeof from === 'string') {
        const to = join(options.outputPath, basename(from));
        cpSync(from, to, { recursive: true });
      } else {
        const { input, glob, output } = from;
        const globber = readdirGlob(input, { pattern: glob });
        await new Promise((resolve, reject) => {
          globber.on('match', (match) => {
            const to = join(options.outputPath, output, match.relative);
            cpSync(match.absolute, to, { recursive: true });
          });
          globber.on('error', reject);
          globber.on('end', resolve);
        });
      }
    }
  }
}

export default async function nccExecutor(options: NccExecutorSchema, context: ExecutorContext) {
  const project = context.projectGraph.nodes[context.projectName];
  const buildTarget = parseTargetString(options.buildTarget, context);
  if (!project.data.targets[buildTarget.target]) {
    throw new Error(
      `Cannot find build target ${chalk.bold(options.buildTarget)} for project ${chalk.bold(context.projectName)}`
    );
  }
  const buildTargetExecutor = project.data.targets[buildTarget.target]?.executor;
  const buildOptions = readTargetOptions(buildTarget, context);
  const fileToRun = getFileToRun(context, project, buildOptions, buildTargetExecutor);
  await run(context.cwd, context.root, buildTarget, {}, context.isVerbose, context.taskGraph);
  await Promise.all([
    nccBuild({ ...options, inputFile: fileToRun }, context),
    copyAssets(buildOptions.assets, options)
  ]);
  return {
    success: true
  };
}

function getFileToRun(
  context: ExecutorContext,
  project: ProjectGraphProjectNode,
  buildOptions: Record<string, any>,
  buildTargetExecutor: string
): string {
  // If using run-commands or another custom executor, then user should set
  // outputFileName, but we can try the default value that we use.
  if (!buildOptions?.outputPath && !buildOptions?.outputFileName) {
    // If we are using crystal for infering the target, we can use the output path from the target.
    // Since the output path has a token for the project name, we need to interpolate it.
    // {workspaceRoot}/dist/{projectRoot} -> dist/my-app
    const outputPath = project.data.targets[buildOptions.target]?.outputs?.[0];

    if (outputPath) {
      const outputFilePath = interpolate(outputPath, {
        projectName: project.name,
        projectRoot: project.data.root,
        workspaceRoot: ''
      });
      return join(outputFilePath, 'main.js');
    }
    const fallbackFile = join('dist', project.data.root, 'main.js');

    logger.warn(
      `Build option ${chalk.bold('outputFileName')} not set for ${chalk.bold(
        project.name
      )}. Using fallback value of ${chalk.bold(fallbackFile)}.`
    );
    return join(context.root, fallbackFile);
  }

  let outputFileName = buildOptions.outputFileName;

  if (!outputFileName) {
    const fileName = `${parse(buildOptions.main).name}.js`;
    if (buildTargetExecutor === '@nx/js:tsc' || buildTargetExecutor === '@nx/js:swc') {
      outputFileName = join(getRelativeDirectoryToProjectRoot(buildOptions.main, project.data.root), fileName);
    } else {
      outputFileName = fileName;
    }
  }

  return join(context.root, buildOptions.outputPath, outputFileName);
}
