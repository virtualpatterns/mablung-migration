import _URL from "url";import { FileSystem } from '@virtualpatterns/mablung-file-system';
import Match from 'minimatch';
import Path from 'path';
import Test from 'ava';

import { MigrateProcess } from './migrate-process.js';
import { Migration } from './migration.js';

const FilePath = _URL.fileURLToPath(import.meta.url);
const FolderPath = Path.dirname(FilePath);

Test.serial('migrate list', async (test) => {
  let process = new MigrateProcess({ 'list': true });
  test.is(await process.whenExit(), 0);
});

Test.serial('migrate create', async (test) => {

  let name = 'migrate-create';

  let process = new MigrateProcess({ 'create': name });
  test.is(await process.whenExit(), 0);

  let folderPath = `${FolderPath}/../../../source/test/command/migration`;
  let pattern = `*-${name}.js`;

  let item = await FileSystem.readdir(folderPath, { 'encoding': 'utf-8', 'withFileTypes': true });
  let path = item.
  filter((item) => item.isFile()).
  filter((file) => Match(file.name, pattern)).
  map((file) => `${folderPath}/${file.name}`);

  test.is(path.length, 1);

  await FileSystem.remove(path[0]);

});

Test.serial('migrate install', async (test) => {

  let process = new MigrateProcess({ 'install': true });
  test.is(await process.whenExit(), 0);

  let migration = await Migration.getMigration();

  test.is(migration.length, 1);
  test.is(await migration[0].isInstalled(), true);

});

Test.serial('migrate uninstall', async (test) => {

  let process = new MigrateProcess({ 'uninstall': true });
  test.is(await process.whenExit(), 0);

  let migration = await Migration.getMigration();

  test.is(migration.length, 1);
  test.is(await migration[0].isInstalled(), false);

});

//# sourceMappingURL=migrate.test.js.map