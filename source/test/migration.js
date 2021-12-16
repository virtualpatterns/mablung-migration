import { FileSystem } from '@virtualpatterns/mablung-file-system'
import { Migration as BaseMigration } from '@virtualpatterns/mablung-migration'
import Is from '@pwn/is'

class Migration extends BaseMigration {

  constructor(path) {
    super(path)
  }

  async isInstalled() {
    return Promise.all([
      FileSystem.pathExists(`${this.path}.installed`),
      FileSystem.pathExists(`${this.path}.uninstalled`)
    ])
      .then((value) => Is.deepEqual(value, [true, false]))
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

}

export { Migration }
