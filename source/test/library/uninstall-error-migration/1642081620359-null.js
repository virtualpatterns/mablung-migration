import { UnInstallErrorMigration } from '../uninstall-error-migration.js'

const FilePath = __filePath

export default class extends UnInstallErrorMigration {

  constructor(option) {
    super(FilePath, option)
  }

  isInstalled() {
    return Promise.resolve(true)
  }

  uninstall() {
    return Promise.reject(new Error())
  }

}
