import Path from 'path'

import { Migration as BaseMigration } from '../../index.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

class Migration extends BaseMigration {

  constructor(path) {
    super(path)
  }

  static createMigration(name, path = Path.normalize(`${FolderPath}/../../../source/test/library/migration`), templatePath = Path.normalize(`${FolderPath}/../../../source/test/library/migration/template.js`)) {
    return super.createMigration(name, path, templatePath)
  }

  static async getMigration(...argument) {
    return (await Promise.all([ super.getMigration(...argument), super.getMigrationFromPath(`${FolderPath}/migration`, [ '*.js' ], [ 'template.js' ], ...argument) ])).flat().sort()
  }

}

export { Migration }