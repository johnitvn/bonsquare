import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import { join } from 'path';
import { ProtoLibraryGeneratorSchema } from './schema';

export async function protoLibraryGenerator(tree: Tree, options: ProtoLibraryGeneratorSchema) {
  const name = `${options.serviceName}-proto`;
  const root = `libs/microservices/${options.serviceName}-proto`;
  await libraryGenerator(tree, {
    name,
    directory: root,
    projectNameAndRootFormat: 'as-provided',
    skipFormat: true
  });

  tree.delete(join(root, 'src', 'lib'));
  generateFiles(tree, join(__dirname, 'files'), root, options);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export default protoLibraryGenerator;
