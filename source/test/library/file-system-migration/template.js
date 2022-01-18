import { FileSystemMigration } from '../file-system-migration.js'

const FilePath = __filePath

export default class extends FileSystemMigration {

  constructor(...argument) {
    super(FilePath, ...argument)
  }

}
