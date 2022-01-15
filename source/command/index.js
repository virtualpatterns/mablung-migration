#!/usr/bin/env node

import '@virtualpatterns/mablung-source-map-support/install'

import Command from 'commander'
import Path from 'path'

import { LoadConfiguration } from './library/load-configuration.js'
import { Package } from './library/package.js'

const Process = process

Command
  .name(Package.name.replace(/^(.*)\/(.*)$/, '$2'))
  .version(Package.version)
  .option('--configuration-path <path>', 'Path of the configuration file (default: "./migration.cjs", "./migration.js", or "./migration.json")')

Command
  .command('create <name>')
  .description('Create a new migration with the given name')
  .action(async (name) => {

    Process.exitCode = 0

    try {

      let configuration = await LoadConfiguration(Command.opts().configurationPath)
      console.log(`Loaded '${Path.relative('', configuration.path)}'`)

      let { [configuration.migration.name]: Migration } = await import(Path.resolve(configuration.migration.path))
      console.log(`Imported '${configuration.migration.name}' from '${Path.relative('', configuration.migration.path)}'`)

      let path = await Migration.createMigration(name)

      console.log(`Created '${Path.relative('', path)}'`)

    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .command('list')
  .description('List all known migrations')
  .action(async () => {

    Process.exitCode = 0

    try {

      let configuration = await LoadConfiguration(Command.opts().configurationPath)
      console.log(`Loaded '${Path.relative('', configuration.path)}'`)

      let { [configuration.migration.name]: Migration } = await import(Path.resolve(configuration.migration.path))
      console.log(`Imported '${configuration.migration.name}' from '${Path.relative('', configuration.migration.path)}'`)

      Migration.onMigration(async (migration) => {

        Process.stdout.write(`Checking '${Path.relative('', migration.path)}' ...`)

        try {
          let isInstalled = await migration.isInstalled()
          Process.stdout.write(` is ${isInstalled ? '' : 'not '}installed\n`)
        } catch (error) {
          Process.stdout.write(' error\n')
          throw error
        }

      }, configuration)
      
    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .command('install')
  .description('Install not-installed migrations')
  .action(async () => {

    Process.exitCode = 0

    try {

      let configuration = await LoadConfiguration(Command.opts().configurationPath)
      console.log(`Loaded '${Path.relative('', configuration.path)}'`)

      let { [configuration.migration.name]: Migration } = await import(Path.resolve(configuration.migration.path))
      console.log(`Imported '${configuration.migration.name}' from '${Path.relative('', configuration.migration.path)}'`)

      // let onInstallHandler = {}

      // Migration.on('preInstall', onInstallHandler.preInstall = (migration) => {
      //   Process.stdout.write(`Installing '${Path.relative('', migration.path)}' ...`)
      // })

      // try {

      //   Migration.on('postInstall', onInstallHandler.postInstall = (migration, error) => {

      //     if (Is.undefined(error)) {
      //       Process.stdout.write(' done\n')
      //     } else {
      //       Process.stdout.write(' error\n')
      //     }

      //   })

      //   try {
      //     await Migration.installMigration(configuration)
      //   } finally {
      //     Migration.off('postInstall', onInstallHandler.postInstall)
      //     delete onInstallHandler.postInstall
      //   }
       
      // } finally {
      //   Migration.off('preInstall', onInstallHandler.preInstall)
      //   delete onInstallHandler.preInstall
      // }

      await Migration.onNotInstalledMigration(async (migration) => {

        Process.stdout.write(`Installing '${Path.relative('', migration.path)}' ...`)

        try {
          await migration.install()
          Process.stdout.write(' done\n')
        } catch (error) {
          Process.stdout.write(' error\n')
          throw error
        }
        
      }, configuration)

    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .command('uninstall')
  .description('Uninstall installed migrations')
  .action(async () => {

    Process.exitCode = 0

    try {

      let configuration = await LoadConfiguration(Command.opts().configurationPath)
      console.log(`Loaded '${Path.relative('', configuration.path)}'`)

      let { [configuration.migration.name]: Migration } = await import(Path.resolve(configuration.migration.path))
      console.log(`Imported '${configuration.migration.name}' from '${Path.relative('', configuration.migration.path)}'`)

      // let onUnInstallHandler = {}

      // Migration.on('preUnInstall', onUnInstallHandler.preUnInstall = (migration) => {
      //   Process.stdout.write(`Uninstalling '${Path.relative('', migration.path)}' ...`)
      // })

      // try {

      //   Migration.on('postUnInstall', onUnInstallHandler.postUnInstall = (migration, error) => {

      //     if (Is.undefined(error)) {
      //       Process.stdout.write(' done\n')
      //     } else {
      //       Process.stdout.write(' error\n')
      //     }

      //   })

      //   try {
      //     await Migration.uninstallMigration(configuration)
      //   } finally {
      //     Migration.off('postUnInstall', onUnInstallHandler.postUnInstall)
      //     delete onUnInstallHandler.postUnInstall
      //   }

      // } finally {
      //   Migration.off('preUnInstall', onUnInstallHandler.preUnInstall)
      //   delete onUnInstallHandler.preUnInstall
      // }

      await Migration.onInstalledMigration(async (migration) => {

        Process.stdout.write(`Uninstalling '${Path.relative('', migration.path)}' ...`)

        try {
          await migration.uninstall()
          Process.stdout.write(' done\n')
        } catch (error) {
          Process.stdout.write(' error\n')
          throw error
        }

      }, configuration)

    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .parse(Process.argv)
