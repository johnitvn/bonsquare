import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { basename, join } from 'path';
import { cwd } from 'process';
import { MongooseSchemaGeneratorSchema } from './schema';

export async function mongooseSchemaGenerator(tree: Tree, options: MongooseSchemaGeneratorSchema) {
  const name = basename(options.name);
  generateFiles(tree, join(__dirname, 'files'), cwd().replace(tree.root, ''), { name });
  await formatFiles(tree);
}

export default mongooseSchemaGenerator;
