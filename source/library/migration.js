import { FileSystem } from '@virtualpatterns/mablung-file-system'
import EventEmitter from 'events'
import Is from '@pwn/is'
import Match from 'minimatch'
import Path from 'path'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

class Migration {
  
  static defaultFrom = undefined
  static defaultTo = undefined

  static eventEmitter = new EventEmitter()

  constructor(path) {
    this.path = path
    this.name = Path.basename(this.path, Path.extname(this.path))
  }

  // derived class must implement ...
  // async isInstalled() {}
  // async install() {}
  // async uninstall() {}

  static async createMigration(name, path = Path.normalize(`${FolderPath}/../../source/library/migration`), templatePath = Path.normalize(`${FolderPath}/../../source/library/migration/template.js`)) {

    let fromPath = templatePath

    let toFolder = path
    let toName = `${Date.now()}-${name}`
    let toExtension = Path.extname(templatePath)

    let toPath = `${toFolder}/${toName}${toExtension}`

    await FileSystem.mkdir(Path.dirname(toPath), { 'recursive': true })
    await FileSystem.copy(fromPath, toPath)

    return toPath

  }

  static async getMigration(includeFrom = Number.MIN_SAFE_INTEGER, includeTo = Number.MAX_SAFE_INTEGER, ...argument) {

    let rawMigration = null
    rawMigration = this.getRawMigration(includeFrom, includeTo, ...argument)

    let migration = null
    migration = await Promise.all(rawMigration)
    migration = migration.sort((leftMigration, rightMigration) => leftMigration.name.localeCompare(rightMigration.name))

    return migration

  }

  static getRawMigration(includeFrom, includeTo, ...argument) {
    return this.getRawMigrationFromPath(`${FolderPath}/migration`, /* [ '*.js' ], [ 'template.js' ], */ includeFrom, includeTo, ...argument)
  }

  static getRawMigrationFromPath(path, /* includePattern, excludePattern, */ includeFrom, includeTo, ...argument) {

    let namePattern = /^(\d+?)-.+?\.c?js$/im

    if (Is.string(includeFrom)) {

      let nameFrom = Path.basename(includeFrom) // , Path.extname(includeFrom))

      if (namePattern.test(nameFrom)) {
        let [, match] = nameFrom.match(namePattern)
        includeFrom = parseInt(match)
      } else {
        includeFrom = Number.MIN_SAFE_INTEGER
      }

    }

    if (Is.string(includeTo)) {

      let nameTo = Path.basename(includeTo) // , Path.extname(includeTo))

      if (namePattern.test(nameTo)) {
        let [, match] = nameTo.match(namePattern)
        includeTo = parseInt(match)
      } else {
        includeTo = Number.MAX_SAFE_INTEGER
      }

    }

    let item = FileSystem.readdirSync(path, { 'encoding': 'utf-8', 'withFileTypes': true })

    let rawMigrationFromPath = item
      .filter((item) => item.isDirectory())
      .map((directory) => this.getRawMigrationFromPath(`${path}/${directory.name}`, /* includePattern, excludePattern,  */ includeFrom, includeTo, ...argument))

    let rawMigration = item
      .filter((item) => item.isFile())
      // .filter((file) => includePattern.reduce((isMatch, pattern) => isMatch ? isMatch : Match(file.name, pattern), false))
      // .filter((file) => !excludePattern.reduce((isMatch, pattern) => isMatch ? isMatch : Match(file.name, pattern), false))
      .filter((file) => {

        if (namePattern.test(file.name)) {

          let [, match] = file.name.match(namePattern)
          let filterAt = parseInt(match)

          return includeFrom <= filterAt && filterAt <= includeTo

        } else {
          return false
        }

      })
      .map((file) => this.importMigration(`${path}/${file.name}`, ...argument))

    return [ ...rawMigrationFromPath, ...rawMigration ].flat()

  }

  static async importMigration(path, ...argument) {

    let Migration = null
    Migration = await import(path)
    Migration = Migration.Migration || Migration

    return new Migration(...argument)
    
  }

  static async installMigration(includeFrom = Number.MIN_SAFE_INTEGER, includeTo = Number.MAX_SAFE_INTEGER, ...argument) {

    let migration = await this.getMigration(includeFrom, includeTo, ...argument)
    let isInstalled = await Promise.all(migration.map((migration) => migration.isInstalled()))

    migration = isInstalled
      .filter((isInstalled) => !isInstalled)
      .map((isInstalled, index) => migration[index])

    for (let item of migration) {
      this.emit('install', item)
      await item.install()
    }

  }

  static async uninstallMigration(includeFrom = Number.MIN_SAFE_INTEGER, includeTo = Number.MAX_SAFE_INTEGER, ...argument) {

    let migration = await this.getMigration(includeFrom, includeTo, ...argument)
    let isInstalled = await Promise.all(migration.map((migration) => migration.isInstalled()))

    migration = isInstalled
      .filter((isInstalled) => isInstalled)
      .map((isInstalled, index) => migration[index])

    for (let item of migration.reverse()) {
      this.emit('uninstall', item)
      await item.uninstall()
    }

  }

}

[
  'on',
  'off',
  'emit'
].forEach((methodName) => {
  Migration[methodName] = function (...argument) {
    this.eventEmitter[methodName](...argument)
  }
})

export { Migration }
