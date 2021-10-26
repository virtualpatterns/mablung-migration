#!/usr/bin/env node

import '@virtualpatterns/mablung-source-map-support/install'

import Command from 'commander'
import Path from 'path'

import { Package } from '../library/package.js'

const Process = process

async function importMigration(path) {

  let Migration = null
  Migration = await import(path)
  Migration = Migration.Migration || Migration

  return Migration
  
}

Command
  .name(Package.name.replace(/^(.*)\/(.*)$/, '$2'))
  .version(Package.version)
  .option('--migration-class-path <path>', 'Path of the migration class to import', 'release/library/migration.js')

Command
  .command('create <name>')
  .description('Create a new migration with the given name')
  .action(async (name) => {

    Process.exitCode = 0

    try {

      const Migration = await importMigration(Path.resolve(Command.opts().migrationClassPath))

      let path = await Migration.createMigration(name)

      console.log(`Created '${Path.relative('', path)}'`)

    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .command('list [argument...]')
  .description('List all known migrations')
  .action(async (argument) => {

    Process.exitCode = 0

    try {

      const Migration = await importMigration(Path.resolve(Command.opts().migrationClassPath))
      
      let migration = await Migration.getMigration(...argument)

      for (let item of migration) {
        console.log(`'${Path.relative('', item.path)}' is ${(await item.isInstalled()) ? '' : 'NOT '}installed`)
      }
      
    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .command('install [argument...]')
  .description('Install uninstalled migrations')
  .action(async (argument) => {

    Process.exitCode = 0

    try {

      const Migration = await importMigration(Path.resolve(Command.opts().migrationClassPath))
      
      await Migration.installMigration(...argument)

    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .command('uninstall [argument...]')
  .description('Uninstall installed migrations')
  .action(async (argument) => {

    Process.exitCode = 0

    try {

      const Migration = await importMigration(Path.resolve(Command.opts().migrationClassPath))
      
      await Migration.uninstallMigration(...argument)

    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .parse(Process.argv)
