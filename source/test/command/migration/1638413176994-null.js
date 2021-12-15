import { Migration as BaseMigration } from '../migration.js'

const FilePath = __filePath

class Migration extends BaseMigration {

  constructor() {
    super(FilePath)
  }

}

export { Migration }
