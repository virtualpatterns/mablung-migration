import { IsInstalledErrorMigration } from '../is-installed-error-migration.js'

const FilePath = __filePath

export default class extends IsInstalledErrorMigration {

  constructor(...argument) {
    super(FilePath, ...argument)
  }

  isInstalled() {
    return Promise.reject(new Error())
  }

}
