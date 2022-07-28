import '@virtualpatterns/mablung-source-map-support/install'

import { Path } from '@virtualpatterns/mablung-path'

const FilePath = __filePath
const FolderPath = __folderPath

// class Migration extends CreateMigration(BaseMigration, Path.resolve(Path.resolve(FolderPath, '../../../source/test/library/migration`), Path.resolve(`${FolderPath}/../../../source/test/library/migration/template.js`), `${FolderPath}/migration')) {

const Process = process

async function main() {

  Process.exitCode = 0

  try {

    // let path = '../../source/test/library/migration'

    // console.log(`path = '${path}'`)
    // console.log(`FolderPath = '${FolderPath}'`)
    // console.log(`Path.resolve(FolderPath, path) = '${Path.resolve(FolderPath, path)}'`)
    // console.log(`Path.normalize(path) = '${Path.normalize(path)}'`)

    const LoadWhatever = function ({ 'install': { 'path': installPath } } = { 'install': { 'path': undefined } }) {
      console.log(`installPath = '${installPath}'`)
    }

    LoadWhatever()

  } catch (error) {
    Process.exitCode = 1
    console.error(error)
  }

}

main()