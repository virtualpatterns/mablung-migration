import { Configuration } from '@virtualpatterns/mablung-configuration'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import Is from '@pwn/is'
import Path from 'path'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

class Migration {

  constructor(path) {

    this.path = path
    this.name = Path.basename(this.path, Path.extname(this.path))

  }

  // derived class must implement ...
  // async isInstalled() {}
  // async install() {}
  // async uninstall() {}

  static async createMigration(name, path = Path.resolve(FolderPath, '../../source/library/migration'), templatePath = Path.resolve(FolderPath, '../../source/library/migration/template.js')) {

    let fromPath = templatePath

    let toFolder = path
    let toName = `${Date.now()}-${name}`
    let toExtension = Path.extname(templatePath)

    let toPath = `${toFolder}/${toName}${toExtension}`

    await FileSystem.ensureDir(Path.dirname(toPath))
    await FileSystem.copy(fromPath, toPath)

    return toPath

  }

  static async getMigration(option) {

    let rawMigration = null
    rawMigration = this.getRawMigration(option)

    let migration = null
    migration = await Promise.all(rawMigration)
    migration = migration.sort((leftMigration, rightMigration) => leftMigration.name.localeCompare(rightMigration.name))

    return migration

  }

  static getRawMigration(option) {
    return this.getRawMigrationFromPath(Path.resolve(FolderPath, './migration'), option)
  }

  static getRawMigrationFromPath(path, userOption = {}) {

    let defaultOption = {
      'include': {
        'from': Number.MIN_SAFE_INTEGER,
        'to': Number.MAX_SAFE_INTEGER
      }
    }

    let option = Configuration.getOption(defaultOption, userOption)

    let namePattern = /^(\d+?)-.+?\.c?js$/im

    if (Is.string(option.include.from)) {

      let nameFrom = Path.basename(option.include.from)

      if (namePattern.test(nameFrom)) {
        let [ , match ] = nameFrom.match(namePattern)
        option.include.from = parseInt(match)
      } else {
        option.include.from = Number.MIN_SAFE_INTEGER
      }

    }

    if (Is.string(option.include.to)) {

      let nameTo = Path.basename(option.include.to)

      if (namePattern.test(nameTo)) {
        let [ , match ] = nameTo.match(namePattern)
        option.include.to = parseInt(match)
      } else {
        option.include.to = Number.MAX_SAFE_INTEGER
      }

    }

    let item = FileSystem.readdirSync(path, { 'encoding': 'utf-8', 'withFileTypes': true })

    let rawMigrationFromPath = item
      .filter((item) => item.isDirectory())
      .map((directory) => this.getRawMigrationFromPath(Path.resolve(path, directory.name), option))

    let rawMigration = item
      .filter((item) => item.isFile())
      .filter((file) => {

        if (namePattern.test(file.name)) {

          let [ , match ] = file.name.match(namePattern)
          let filterAt = parseInt(match)

          return option.include.from <= filterAt && filterAt <= option.include.to

        } else {
          return false
        }

      })
      .map((file) => {
        return import(Path.resolve(path, file.name))
          .then(({ 'default': Migration }) => new Migration(option))
      })

    return [ ...rawMigrationFromPath, ...rawMigration ].flat()

  }

  static async onMigration(fn, option) { 

    let migration = await this.getMigration(option)

    for (let index = 0; index < migration.length; index ++) {
      await fn(migration[index], index, migration)
    }

  }

  static async onInstalledMigration(fn, option) { 

    let migration = await this.getMigration(option)
    let isInstalled = await Promise.all(migration.map((migration) => migration.isInstalled()))

    migration = isInstalled
      .filter((isInstalled) => isInstalled)
      .map((isInstalled, index) => migration[index])

    for (let index = migration.length - 1; index >= 0; index--) {
      await fn(migration[index], index, migration)
    }

  }

  static async onNotInstalledMigration(fn, option) { 

    let migration = await this.getMigration(option)
    let isInstalled = await Promise.all(migration.map((migration) => migration.isInstalled()))

    migration = isInstalled
      .filter((isInstalled) => !isInstalled)
      .map((isInstalled, index) => migration[index])

    for (let index = 0; index < migration.length; index++) {
      await fn(migration[index], index, migration)
    }

  }

  static installMigration(option) {

    // let migration = await this.getMigration(option)
    // let isInstalled = await Promise.all(migration.map((migration) => migration.isInstalled()))

    // migration = isInstalled
    //   .filter((isInstalled) => !isInstalled)
    //   .map((isInstalled, index) => migration[index])

    // for (let item of migration) {

    //   this.emit('preInstall', item)

    //   try {
    //     await item.install()
    //     this.emit('postInstall', item)
    //   } catch (error) {
    //     this.emit('postInstall', item, error)
    //     throw error
    //   }

    // }

    return this.onNotInstalledMigration((migration) => {
      return migration.install()
    }, option)

  }

  static uninstallMigration(option) {

    // let migration = await this.getMigration(option)
    // let isInstalled = await Promise.all(migration.map((migration) => migration.isInstalled()))

    // migration = isInstalled
    //   .filter((isInstalled) => isInstalled)
    //   .map((isInstalled, index) => migration[index])

    // for (let item of migration.reverse()) {

    //   this.emit('preUnInstall', item)

    //   try {
    //     await migration.uninstall()
    //     this.emit('postUnInstall', item)
    //   } catch (error) {
    //     this.emit('postUnInstall', item, error)
    //     throw error
    //   }

    // }

    return this.onInstalledMigration((migration) => {
      return migration.uninstall()
    }, option)

  }

}

// [
//   'on',
//   'off',
//   'emit'
// ].forEach((methodName) => {
//   Migration[methodName] = function (...argument) {
//     this.eventEmitter[methodName](...argument)
//   }
// })

export { Migration }
