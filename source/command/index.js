#!/usr/bin/env node

import '@virtualpatterns/mablung-source-map-support/install'

import Command from 'commander'
import Path from 'path'

import { Package } from '../library/package.js'

const Process = process

Command
  .name(Package.name.replace(/^(.*)\/(.*)$/, '$2'))
  .version(Package.version)
  .option('--include-from <from>', 'Used by the list, install, and uninstall commands, defines the first migration to consider', (value) => {

    switch (true) {
      case /^\d+?$/.test(value):
        return parseInt(value)
      default:
        return Path.resolve(value)
    }

  }, Number.MIN_SAFE_INTEGER)
  .option('--include-to <to>', 'Used by the list, install, and uninstall commands, defines the last migration to consider', (value) => {

    switch (true) {
      case /^\d+?$/.test(value):
        return parseInt(value)
      default:
        return Path.resolve(value)
    }

  }, Number.MAX_SAFE_INTEGER)
  .option('--migration-path <path>', 'Path of the migration to import', (value) => Path.resolve(value), './release/library/migration.js')

Command
  .command('create <name>')
  .description('Create a new migration with the given name')
  .action(async (name) => {

    Process.exitCode = 0

    try {

      const option = Command.opts()

      const { Migration } = await import(option.migrationPath)

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
  .action(async(argument) => {

    Process.exitCode = 0

    try {

      const option = Command.opts()

      const { Migration } = await import(option.migrationPath)

      let migration = await Migration.getMigration(option.includeFrom, option.includeTo, ...argument)

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

      const option = Command.opts()

      const { Migration } = await import(option.migrationPath)

      await Migration.installMigration(option.includeFrom, option.includeTo, ...argument)

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

      const option = Command.opts()

      const { Migration } = await import(option.migrationPath)

      await Migration.uninstallMigration(option.includeFrom, option.includeTo, ...argument)

    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .parse(Process.argv)
