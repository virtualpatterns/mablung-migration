#!/usr/bin/env node
var _Package$migrate, _Package$migrate2;
import '@virtualpatterns/mablung-source-map-support/install';
import Command from 'commander';
import { FileSystem } from '@virtualpatterns/mablung-file-system';
import JSON5 from 'json5';
import Path from 'path';
import URL from 'url';

const Package = JSON5.parse(FileSystem.readFileSync('package.json'), { 'encoding': 'utf-8' });
const Process = process;

const MigrationClassPath = ((_Package$migrate = Package.migrate) === null || _Package$migrate === void 0 ? void 0 : _Package$migrate.migrationClassPath) || 'distributable/library/migration.js';
const MigrationExportName = ((_Package$migrate2 = Package.migrate) === null || _Package$migrate2 === void 0 ? void 0 : _Package$migrate2.migrationExportName) || 'Migration';

async function importMigration(path, name) {

  let migration = null;
  migration = await import(URL.pathToFileURL(path));
  migration = migration[name] || migration;

  return migration;

}

Command.
version(Package.version).
option('--migration-class-path <path>', 'Path of the migration class to import', MigrationClassPath).
option('--migration-export-name <name>', 'Exported name of the migration class to import', MigrationExportName);

Command.
command('list [parameter...]').
description('List all known migrations').
action(async parameter => {

  try {

    let Migration = await importMigration(Command.opts().migrationClassPath, Command.opts().migrationExportName);

    for (let migration of await Migration.getMigration(...parameter)) {
      console.log(`'${Path.relative('', migration.path)}' is ${(await migration.isInstalled()) ? '' : 'NOT '}installed`);
    }

    Process.exit(0);

  } catch (error) {
    console.error(error);
    Process.exit(1);
  }

});

Command.
command('create <name>').
description('Create a new migration with the given name in the default folder').
action(async name => {

  let Migration = await importMigration(Command.opts().migrationClassPath, Command.opts().migrationExportName);

  try {

    console.log(`Created ${Path.relative('', await Migration.createMigration(name))}`);
    Process.exit(0);

  } catch (error) {
    console.error(error);
    Process.exit(1);
  }

});

Command.
command('install [parameter...]').
description('Install known, uninstalled migrations').
action(async parameter => {

  let Migration = await importMigration(Command.opts().migrationClassPath, Command.opts().migrationExportName);

  try {

    await Migration.installMigration(...parameter);
    Process.exit(0);

  } catch (error) {
    console.error(error);
    Process.exit(1);
  }

});

Command.
command('uninstall [parameter...]').
description('Uninstall all known, installed migrations').
action(async parameter => {

  let Migration = await importMigration(Command.opts().migrationClassPath, Command.opts().migrationExportName);

  try {

    await Migration.uninstallMigration(...parameter);
    Process.exit(0);

  } catch (error) {
    console.error(error);
    Process.exit(1);
  }

});

Command.parse(Process.argv);
//# sourceMappingURL=migrate.js.map