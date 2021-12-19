import { Migration as BaseMigration } from '../../migration.js'

const FilePath = __filePath

class Migration extends BaseMigration {

  constructor(installPath) {
    super(FilePath, installPath)
  }

}

export { Migration }
