import { Migration } from '../migration.js'

const FilePath = __filePath

export default class extends Migration {

  constructor(...argument) {
    super(FilePath, ...argument)
  }

  // must implement directly or through inheritance ...
  // async isInstalled() {}
  // async install() {}
  // async uninstall() {}

}
