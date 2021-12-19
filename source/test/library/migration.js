import { CreateMigration, Migration as BaseMigration } from '@virtualpatterns/mablung-migration'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import Is from '@pwn/is'
import Path from 'path'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

class Migration extends CreateMigration(BaseMigration, Path.resolve(`${FolderPath}/../../../source/test/library/migration`), Path.resolve(`${FolderPath}/../../../source/test/library/migration/template.js`), `${FolderPath}/migration`) {

  constructor(path, installPath) {
    super(path)

    this.installPath = installPath
    this.installedPath = `${this.installPath}/${this.name}.installed`
    this.uninstalledPath = `${this.installPath}/${this.name}.uninstalled`

  }

  async isInstalled() {
    return Promise.all([
      FileSystem.pathExists(this.installedPath),
      FileSystem.pathExists(this.uninstalledPath)
    ])
      .then((value) => Is.deepEqual(value, [ true, false ]))
  }

  install() {
    return Promise.all([
      FileSystem.touch(this.installedPath),
      FileSystem.remove(this.uninstalledPath)
    ])
  }

  uninstall() {
    return FileSystem.touch(this.uninstalledPath)
  }

  static getRawMigration(includeFrom, includeTo, ...argument) {

    let [ installPath ] = argument
    installPath = Path.resolve(installPath)

    FileSystem.ensureDirSync(installPath)
    
    return super.getRawMigration(includeFrom, includeTo, installPath)

  }

  static async installMigration(includeFrom, includeTo, ...argument) {

    let [ installPath ] = argument
    installPath = Path.resolve(installPath)

    await FileSystem.ensureDir(installPath)
    
    return super.installMigration(includeFrom, includeTo, installPath)

  }

  static async uninstallMigration(includeFrom, includeTo, ...argument) {

    let [ installPath ] = argument
    installPath = Path.resolve(installPath)

    await FileSystem.ensureDir(installPath)
    
    return super.uninstallMigration(includeFrom, includeTo, installPath)

  }

}

export { Migration }
