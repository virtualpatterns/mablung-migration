import { InstallErrorMigration } from '../install-error-migration.js'

const FilePath = __filePath

export default class extends InstallErrorMigration {

  constructor(option) {
    super(FilePath, option)
  }

  isInstalled() {
    return Promise.resolve(false)
  }

  install() {
    return Promise.reject(new Error())
  }

}
