import { Configuration } from '@virtualpatterns/mablung-configuration'
import { CreateRandomId, LoggedForkedProcess } from '@virtualpatterns/mablung-worker/test'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import { Path } from '@virtualpatterns/mablung-path'
import Test from 'ava'

import { Migration } from '../library/migration.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js/, '')

Test.before(() => {
  return FileSystem.emptyDir(DataPath)
})

Test.beforeEach(async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  test.context.logPath = logPath

  // test.log(`test.context.logPath = '${Path.relative('', test.context.logPath)}'`)

})

Test('default', async (test) => {
  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'))
  test.is(await process.whenExit(), 1)
})

Test('create', async (test) => {

  let name = `create-migration-for-${Path.basename(FilePath, Path.extname(FilePath)).replace('.test', '')}`

  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, 'migration.json'),
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

Test('create throws ENOENT', async (test) => {

  let name = 'create-migration'

  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, 'error.json'),
    'create': name
  })

  test.is(await process.whenExit(), 1)

})

Test('list', async (test) => {

  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, 'migration.json'),
    'list': true
  })

  test.is(await process.whenExit(), 0)

})

Test('list throws ENOENT', async (test) => {

  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, 'error.json'),
    'list': true
  })

  test.is(await process.whenExit(), 1)

})

Test('install', async (test) => {

  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, 'migration.json'),
    'install': true
  })

  test.is(await process.whenExit(), 0)
  
  let option = await Configuration.load(Path.resolve(FolderPath, 'migration.json'))
  let migration = await Migration.getMigration(option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test('install throws ENOENT', async (test) => {

  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, 'error.json'),
    'install': true
  })

  test.is(await process.whenExit(), 1)

})

Test('uninstall', async (test) => {

  let process = null

  process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, 'migration.json'),
    'install': true
  })

  test.is(await process.whenExit(), 0)

  process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, 'migration.json'),
    'uninstall': true
  })

  test.is(await process.whenExit(), 0)

  let option = await Configuration.load(Path.resolve(FolderPath, 'migration.json'))
  let migration = await Migration.getMigration(option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test('uninstall throws ENOENT', async (test) => {

  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, 'error.json'),
    'uninstall': true
  })

  test.is(await process.whenExit(), 1)

})
