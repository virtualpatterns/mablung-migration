import { Migration } from '../../migration.js'

const FilePath = __filePath

export default class extends Migration {

  constructor(...argument) {
    super(FilePath, ...argument)
  }

}
