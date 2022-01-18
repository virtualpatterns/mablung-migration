import { UnInstallErrorMigration } from '../uninstall-error-migration.js'

const FilePath = __filePath

export default class extends UnInstallErrorMigration {

  constructor(...argument) {
    super(FilePath, ...argument)
  }

  isInstalled() {
    return Promise.resolve(true)
  }

  uninstall() {
    return Promise.reject(new Error())
  }

}
