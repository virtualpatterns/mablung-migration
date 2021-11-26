import { Migration as BaseMigration } from '../../../migration.js'

const FilePath = __filePath

class Migration extends BaseMigration {

  constructor(path = FilePath) {
    super(path)
  }

}

export { Migration }
