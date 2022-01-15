import { Configuration } from '@virtualpatterns/mablung-configuration'
import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import { ForkedProcess } from '@virtualpatterns/mablung-worker'
import Path from 'path'
import Test from 'ava'

import { NullMigration } from '../library/null-migration.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const DataPath = FilePath.replace('/release/', '/data/').replace('.test.js', '')
const InstallPath = DataPath
const LogPath = DataPath.concat('.log')
const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test.beforeEach(async () => {
  await FileSystem.remove(InstallPath)
  return FileSystem.ensureDir(InstallPath)
})

Test.serial('default', async (test) => {
  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'))
  test.is(await process.whenExit(), 1)
})

Test.serial('create', async (test) => {

  let name = `create-migration-for-${Path.basename(FilePath, Path.extname(FilePath)).replace('.test', '')}`

  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, './null-migration.json'),
    'create': name
  })

  let pattern = /created '(.*?)'/mi
  let output = await process.whenOutput((output) => pattern.test(output))

  let [ , path ] = output.match(pattern)
  
  test.true(await FileSystem.pathExists(path))
  
  await FileSystem.remove(path)

  // test.is(await process.whenExit(), 0)

  // let folderPath = Path.resolve(FolderPath, '../../../source/test/library/migration-0')
  // let pattern = `*-${name}.js`

  // let item = await FileSystem.readdir(folderPath, { 'encoding': 'utf-8', 'withFileTypes': true })
  // let path = item
  //   .filter((item) => item.isFile())
  //   .filter((file) => Match(file.name, pattern))
  //   .map((file) => `${folderPath}/${file.name}`)

  // path.forEach((item) => test.log(Path.relative('', item)))
  // test.is(path.length, 1)


})

Test.serial('create throws ENOENT', async (test) => {

  let name = 'create-migration'

  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, './error.json'),
    'create': name
  })

  test.is(await process.whenExit(), 1)

})

Test.serial('list', async (test) => {

  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, './null-migration.json'),
    'list': true
  })

  test.is(await process.whenExit(), 0)

})

Test.serial('list throws ENOENT', async (test) => {

  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, './error.json'),
    'list': true
  })

  test.is(await process.whenExit(), 1)

})

Test.serial('install', async (test) => {

  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, './null-migration.json'),
    'install': true
  })

  test.is(await process.whenExit(), 0)
  
  let option = await Configuration.load(Path.resolve(FolderPath, './null-migration.json'))
  let migration = await NullMigration.getMigration(option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('install throws ENOENT', async (test) => {

  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, './error.json'),
    'install': true
  })

  test.is(await process.whenExit(), 1)

})

Test.serial('uninstall', async (test) => {

  let process = null

  process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, './null-migration.json'),
    'install': true
  })

  test.is(await process.whenExit(), 0)

  process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, './null-migration.json'),
    'uninstall': true
  })

  test.is(await process.whenExit(), 0)

  let option = await Configuration.load(Path.resolve(FolderPath, './null-migration.json'))
  let migration = await NullMigration.getMigration(option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstall throws ENOENT', async (test) => {

  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, './error.json'),
    'uninstall': true
  })

  test.is(await process.whenExit(), 1)

})
