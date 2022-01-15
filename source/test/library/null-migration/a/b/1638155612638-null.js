import { NullMigration } from '../../../null-migration.js'

const FilePath = __filePath

export default class extends NullMigration {

  constructor(option) {
    super(FilePath, option)
  }

}
