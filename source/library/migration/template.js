import { Migration as BaseMigration } from '../migration.js'

const FilePath = __filePath

class Migration extends BaseMigration {

  constructor(path = FilePath) {
    super(path)
  }

  install() {
    return super.install()
  }

  uninstall() {
    return super.uninstall()
  }

}

export { Migration }
