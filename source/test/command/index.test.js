import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import { ForkedProcess } from '@virtualpatterns/mablung-worker'
import Match from 'minimatch'
import Path from 'path'
import Test from 'ava'

import { Migration } from '../library/migration.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)
const Require = __require

const InstallPath = 'data/migration/command'
const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.js$/, '.log')
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
  let process = new LoggedProcess(Require.resolve('../../command/index.js'))
  test.is(await process.whenExit(), 1)
})

Test.serial('create', async (test) => {

  let name = 'create-migration'

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': Require.resolve('../library/migration.js'),
    'create': name
  })

  test.is(await process.whenExit(), 0)

  let folderPath = `${FolderPath}/../../../source/test/library/migration`
  let pattern = `*-${name}.js`

  let item = await FileSystem.readdir(folderPath, { 'encoding': 'utf-8', 'withFileTypes': true })
  let path = item
    .filter((item) => item.isFile())
    .filter((file) => Match(file.name, pattern))
    .map((file) => `${folderPath}/${file.name}`)

  path.forEach((item) => test.log(Path.relative('', item)))
  test.is(path.length, 1)

  await FileSystem.remove(path[0])

})

Test.serial('create throws Error', async (test) => {

  let name = 'create'

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': `${FolderPath}/error.js`,
    'create': name
  })

  test.is(await process.whenExit(), 1)

})

Test.serial('list', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': Require.resolve('../library/migration.js'),
    'list': InstallPath
  })

  test.is(await process.whenExit(), 0)

})

Test.serial('list --include-from ...', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': 1638155600628,
    '--migration-path': Require.resolve('../library/migration.js'),
    'list': InstallPath
  })

  test.is(await process.whenExit(), 0)

})

Test.serial('list --include-from ... --include-to ...', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': 1638155600628,
    '--include-to': 1638155600628,
    '--migration-path': Require.resolve('../library/migration.js'),
    'list': InstallPath
  })

  test.is(await process.whenExit(), 0)

})

Test.serial('list --include-to ...', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-to': 1638155600628,
    '--migration-path': Require.resolve('../library/migration.js'),
    'list': InstallPath
  })

  test.is(await process.whenExit(), 0)

})

Test.serial('list --include-from \'...\'', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--migration-path': Require.resolve('../library/migration.js'),
    'list': InstallPath
  })

  test.is(await process.whenExit(), 0)

})

Test.serial('list --include-from \'...\' --include-to \'...\'', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--include-to': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--migration-path': Require.resolve('../library/migration.js'),
    'list': InstallPath
  })

  test.is(await process.whenExit(), 0)

})

Test.serial('list --include-to \'...\'', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-to': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--migration-path': Require.resolve('../library/migration.js'),
    'list': InstallPath
  })

  test.is(await process.whenExit(), 0)

})

Test.serial('list throws Error', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': `${FolderPath}/error.js`,
    'list': InstallPath
  })

  test.is(await process.whenExit(), 1)

})

Test.serial('install', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)
  
  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('install --include-from ...', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': 1638155600628,
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('install --include-from ... --include-to ...', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': 1638155600628,
    '--include-to': 1638155600628,
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('install --include-to ...', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-to': 1638155600628,
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('install --include-from \'...\'', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('install --include-from \'...\' --include-to \'...\'', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--include-to': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('install --include-to \'...\'', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-to': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('install throws Error', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': `${FolderPath}/error.js`,
    'install': InstallPath
  })

  test.is(await process.whenExit(), 1)

})

Test.serial('uninstall', async (test) => {

  let process = null

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': Require.resolve('../library/migration.js'),
    'uninstall': InstallPath
  })

  test.is(await process.whenExit(), 0)
  
  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstall --include-from ...', async (test) => {

  let process = null

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': 1638155600628,
    '--migration-path': Require.resolve('../library/migration.js'),
    'uninstall': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstall --include-from ... --include-to ...', async (test) => {

  let process = null

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': 1638155600628,
    '--include-to': 1638155600628,
    '--migration-path': Require.resolve('../library/migration.js'),
    'uninstall': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('uninstall --include-to ...', async (test) => {

  let process = null

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-to': 1638155600628,
    '--migration-path': Require.resolve('../library/migration.js'),
    'uninstall': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('uninstall --include-from \'...\'', async (test) => {

  let process = null

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--migration-path': Require.resolve('../library/migration.js'),
    'uninstall': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstall --include-from \'...\' --include-to \'...\'', async (test) => {

  let process = null

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-from': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--include-to': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--migration-path': Require.resolve('../library/migration.js'),
    'uninstall': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('uninstall --include-to \'...\'', async (test) => {

  let process = null

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': Require.resolve('../library/migration.js'),
    'install': InstallPath
  })

  test.is(await process.whenExit(), 0)

  process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--include-to': Require.resolve('../library/migration/a/1638155600628-null.js'),
    '--migration-path': Require.resolve('../library/migration.js'),
    'uninstall': InstallPath
  })

  test.is(await process.whenExit(), 0)

  let migration = await Migration.getMigration(undefined, undefined, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('uninstall throws Error', async (test) => {

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), {
    '--migration-path': `${FolderPath}/error.js`,
    'uninstall': InstallPath
  })

  test.is(await process.whenExit(), 1)

})
