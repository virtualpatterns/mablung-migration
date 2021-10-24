import { FileSystem } from '@virtualpatterns/mablung-file-system'
import Luxon from 'luxon'
import Match from 'minimatch'
import Path from 'path'
import URL from 'url'

const { DateTime } = Luxon
const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

class Migration {

  constructor(path) {
    this._path = path
    this._name = Path.basename(this._path, Path.extname(this._path))
  }

  /* c8 ignore next 3 */
  get path() {
    return this._path
  }

  /* c8 ignore next 3 */
  get name() {
    return this._name
  }

  async isInstalled() {
    return   (await FileSystem.pathExists(`${Path.dirname(this._path)}/${this._name}.installed`)) && 
            !(await FileSystem.pathExists(`${Path.dirname(this._path)}/${this._name}.uninstalled`))
  }

  install() {
    return Promise.all([
      FileSystem.touch(`${Path.dirname(this._path)}/${this._name}.installed`),
      FileSystem.remove(`${Path.dirname(this._path)}/${this._name}.uninstalled`)
    ])
  }

  uninstall() {
    return FileSystem.touch(`${Path.dirname(this._path)}/${this._name}.uninstalled`)
  }

  toString() {
    return this._name
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

  static getMigration(...argument) {
    return this.getMigrationFromPath(`${FolderPath}/migration`, [ '*.js' ], [ 'template.js' ], ...argument)
  }

  static async getMigrationFromPath(path, includePattern, excludePattern, ...argument) {

    await FileSystem.ensureDir(path)
    let item = await FileSystem.readdir(path, { 'encoding': 'utf-8', 'withFileTypes': true })

    let getMigrationFromPathPromise = item
      .filter((item) => item.isDirectory())
      .map((directory) => this.getMigrationFromPath(`${path}/${directory.name}`, includePattern, excludePattern, ...argument))

    let importMigrationPromise = item
      .filter((item) => item.isFile())
      .filter((file) => includePattern.reduce((isMatch, pattern) => isMatch ? isMatch : Match(file.name, pattern), false))
      .filter((file) => !excludePattern.reduce((isMatch, pattern) => isMatch ? isMatch : Match(file.name, pattern), false))
      .map((file) => this.importMigration(`${path}/${file.name}`, ...argument))

    return (await Promise.all([...getMigrationFromPathPromise, ...importMigrationPromise])).flat().sort()

  }

  static async importMigration(path, ...argument) {

    let migration = null
    migration = await import(URL.pathToFileURL(path))
    migration = migration.default || migration

    return new migration(path, ...argument)
    
  }

  static async installMigration(...argument) {

    for (let migration of (await this.getMigration(...argument))) {

      if (await migration.isInstalled()) {
        // do nothing
      } else {
        await migration.install()
      }

    }

  }

  static async uninstallMigration(...argument) {

    for (let migration of (await this.getMigration(...argument)).reverse()) {

      if (await migration.isInstalled()) {
        await migration.uninstall()
      }

    }

  }

}

export { Migration }
