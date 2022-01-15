import { CreateMigration, Migration } from '@virtualpatterns/mablung-migration'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import Is from '@pwn/is'
import Path from 'path'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

class FileSystemMigration extends CreateMigration(Migration, Path.resolve(FolderPath, './file-system-migration')) {

  constructor(path, { 'install': { 'path': installPath } }) {
    super(path)

    this.installedPath = Path.resolve(installPath, `./${this.name}.installed`)
    this.unInstalledPath = Path.resolve(installPath, `./${this.name}.uninstalled`)

  }

  async isInstalled() {

    let value = await Promise.all([
      FileSystem.pathExists(this.installedPath),
      FileSystem.pathExists(this.unInstalledPath)
    ])

    return Is.deepEqual(value, [ true, false ])
    
  }

  async install() {

    await FileSystem.ensureDir(Path.dirname(this.installedPath))

    return Promise.all([
      FileSystem.touch(this.installedPath),
      FileSystem.remove(this.unInstalledPath)
    ])
    
  }

  async uninstall() {

    if (await FileSystem.pathExists(this.installedPath)) {
      await FileSystem.touch(this.unInstalledPath)
    }

  }

}

export { FileSystemMigration }
