import { CreateLoggedProcess, ForkedProcess } from '@virtualpatterns/mablung-worker'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import Match from 'minimatch'
import Path from 'path'
import Test from 'ava'

import { Migration } from './migration.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)
const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.js$/, '.log')
const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)
const Require = __require

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('default', async (test) => {
  let process = new LoggedProcess(Require.resolve('../../command/index.js'))
  test.is(await process.whenExit(), 1)
})

Test.serial('create', async (test) => {

  let name = 'mablung-migration-create'

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-class-path': Require.resolve('./migration.js'),
    'create': name
  })

  test.is(await process.whenExit(), 0)

  let folderPath = `${FolderPath}/../../../source/test/command/migration`
  let pattern = `*-${name}.js`

  let item = await FileSystem.readdir(folderPath, { 'encoding': 'utf-8', 'withFileTypes': true })
  let path = item
    .filter((item) => item.isFile())
    .filter((file) => Match(file.name, pattern))
    .map((file) => `${folderPath}/${file.name}`)

  // test.log(Path.relative('', path[0]))
  test.is(path.length, 1)

  await FileSystem.remove(path[0])

})

Test('create throws Error', async (test) => {

  let name = 'mablung-migration-create'

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-class-path': `${FolderPath}/error.js`,
    'create': name
  })

  test.is(await process.whenExit(), 1)

})

Test.serial('list', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-class-path': Require.resolve('./migration.js'),
    'list': true
  })

  test.is(await process.whenExit(), 0)

})

Test.serial('list throws Error', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-class-path': `${FolderPath}/error.js`,
    'list': true
  })

  test.is(await process.whenExit(), 1)

})

Test.serial('install', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-class-path': Require.resolve('./migration.js'),
    'install': true
  })

  test.is(await process.whenExit(), 0)
  
  let migration = await Migration.getMigration(Migration.getRawMigration())

  test.is(migration.length, 2)
  test.is(await migration[1].isInstalled(), true)

})

Test.serial('install throws Error', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-class-path': `${FolderPath}/error.js`,
    'install': true
  })

  test.is(await process.whenExit(), 1)

})

Test.serial('uninstall', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-class-path': Require.resolve('./migration.js'),
    'uninstall': true
  })

  test.is(await process.whenExit(), 0)
  
  let migration = await Migration.getMigration(Migration.getRawMigration())

  test.is(migration.length, 2)
  test.is(await migration[1].isInstalled(), false)

})

Test.serial('uninstall throws Error', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-class-path': `${FolderPath}/error.js`,
    'uninstall': true
  })

  test.is(await process.whenExit(), 1)

})
