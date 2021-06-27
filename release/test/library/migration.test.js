import _URL from "url";import { FileSystem } from '@virtualpatterns/mablung-file-system';
import Match from 'minimatch';
import Path from 'path';
import Test from 'ava';

import { Migration } from '../library//migration.js';

const FilePath = _URL.fileURLToPath(import.meta.url);
const FolderPath = Path.dirname(FilePath);

Test.serial('Migration.createMigration(name)', async (test) => {

  let name = 'migration-create-migration';

  await Migration.createMigration(name);

  let folderPath = Path.normalize(`${FolderPath}/../../../source/test/library/migration`);
  let pattern = `*-${name}.js`;

  let item = await FileSystem.readdir(folderPath, { 'encoding': 'utf-8', 'withFileTypes': true });
  let path = item.
  filter((item) => item.isFile()).
  filter((file) => Match(file.name, pattern)).
  map((file) => `${folderPath}/${file.name}`);

  test.is(path.length, 1);

  await FileSystem.remove(path[0]);

});

Test.serial('Migration.getMigration()', async (test) => {

  let migration = await Migration.getMigration();

  test.is(migration.length, 3);

  test.is(migration[0].name, '00000000000000-null');
  test.is(await migration[0].isInstalled(), false);
  test.is(migration[1].name, '00000000000001-null');
  test.is(await migration[1].isInstalled(), false);
  test.is(migration[2].name, '00000000000002-null');
  test.is(await migration[2].isInstalled(), false);

});

Test.serial('Migration.installMigration()', async (test) => {

  await Migration.installMigration();

  let migration = await Migration.getMigration();

  test.is(migration.length, 3);

  test.is(await migration[0].isInstalled(), true);
  test.is(await migration[1].isInstalled(), true);
  test.is(await migration[2].isInstalled(), true);

});

Test.serial('Migration.uninstallMigration()', async (test) => {

  await Migration.uninstallMigration();

  let migration = await Migration.getMigration();

  test.is(migration.length, 3);

  test.is(await migration[0].isInstalled(), false);
  test.is(await migration[1].isInstalled(), false);
  test.is(await migration[2].isInstalled(), false);

});

//# sourceMappingURL=migration.test.js.map