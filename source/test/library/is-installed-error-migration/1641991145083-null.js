import { IsInstalledErrorMigration } from '../is-installed-error-migration.js'

const FilePath = __filePath

export default class extends IsInstalledErrorMigration {

  constructor(option) {
    super(FilePath, option)
  }

  isInstalled() {
    return Promise.reject(new Error())
  }

}
