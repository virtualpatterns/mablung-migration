import { FileSystem } from '@virtualpatterns/mablung-file-system'
import { DateTime } from 'luxon'
import Is from '@pwn/is'
import Match from 'minimatch'
import Path from 'path'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

class Migration {

  constructor(path = FilePath) {
    this.path = path
  }

  get name() {
    return Path.basename(this.path, Path.extname(this.path))
  }

  async isInstalled() {
    return Is.deepEqual(await Promise.all([
      FileSystem.pathExists(`${this.path}.installed`),
      FileSystem.pathExists(`${this.path}.uninstalled`)
    ]), [ true, false ])
  }

  async isNotInstalled() {
    return !(await this.isInstalled())
  }

  install() {
    return Promise.all([
      FileSystem.touch(`${this.path}.installed`),
      FileSystem.remove(`${this.path}.uninstalled`)
    ])
  }

  uninstall() {
    return FileSystem.touch(`${this.path}.uninstalled`)
  }

  static async createMigration(name, path = Path.normalize(`${FolderPath}/../../source/library/migration`), templatePath = Path.normalize(`${FolderPath}/../../source/library/migration/template.js`)) {

    let fromPath = templatePath

    let toFolder = path
    let toName = `${DateTime.utc().toFormat('yyyyLLddHHmmss')}-${name}`
    let toExtension = Path.extname(templatePath)

    let toPath = `${toFolder}/${toName}${toExtension}`

    await FileSystem.mkdir(Path.dirname(toPath), { 'recursive': true })
    await FileSystem.copy(fromPath, toPath)

    return toPath

  }

  static async getMigration(...argument) {
    return (await Promise.all(this.getRawMigration(...argument))).sort((leftMigration, rightMigration) => leftMigration.name.localeCompare(rightMigration.name))
  }

  static getRawMigration(...argument) {
    return this.getRawMigrationFromPath(`${FolderPath}/migration`, [ '*.js' ], [ 'template.js' ], ...argument)
  }

  static getRawMigrationFromPath(path, includePattern, excludePattern, ...argument) {

    let item = FileSystem.readdirSync(path, { 'encoding': 'utf-8', 'withFileTypes': true })

    let getRawMigrationFromPath = item
      .filter((item) => item.isDirectory())
      .map((directory) => this.getRawMigrationFromPath(`${path}/${directory.name}`, includePattern, excludePattern, ...argument))

    let importMigration = item
      .filter((item) => item.isFile())
      .filter((file) => includePattern.reduce((isMatch, pattern) => isMatch ? isMatch : Match(file.name, pattern), false))
      .filter((file) => !excludePattern.reduce((isMatch, pattern) => isMatch ? isMatch : Match(file.name, pattern), false))
      .map((file) => this.importMigration(`${path}/${file.name}`, ...argument))

    return [ ...getRawMigrationFromPath, ...importMigration ].flat()

  }

  static async importMigration(path, ...argument) {

    let Migration = null
    Migration = await import(path)
    Migration = Migration.Migration || Migration

    return new Migration(path, ...argument)
    
  }

  static async installMigration(...argument) {

    let migration = await this.getMigration(...argument)

    for (let item of migration) {

      if (await item.isNotInstalled()) {
        await item.install()
      }

    }

  }

  static async uninstallMigration(...argument) {

    let migration = await this.getMigration(...argument)

    for (let item of migration.reverse()) {

      if (await item.isInstalled()) {
        await item.uninstall()
      }

    }

  }

}

export { Migration }
