import { FileSystem } from '@virtualpatterns/mablung-file-system'
import Match from 'minimatch'
import Path from 'path'
import Test from 'ava'

import { Migration } from './migration.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)
const Require = __require

const MigrationPath = Require.resolve('./migration/20211028000015-null.js')

Test.beforeEach(() => {
  return Promise.all([
    FileSystem.remove(`${Require.resolve('../../library/migration/20211027025141-initial.js')}.installed`),
    FileSystem.remove(`${Require.resolve('../../library/migration/20211027025141-initial.js')}.uninstalled`),
    FileSystem.remove(`${Require.resolve('./migration/20211028000015-null.js')}.installed`),
    FileSystem.remove(`${Require.resolve('./migration/20211028000015-null.js')}.uninstalled`),
    FileSystem.remove(`${Require.resolve('./migration/a/20211027235941-null.js')}.installed`),
    FileSystem.remove(`${Require.resolve('./migration/a/20211027235941-null.js')}.uninstalled`),
    FileSystem.remove(`${Require.resolve('./migration/a/b/20211028000056-null.js')}.installed`),
    FileSystem.remove(`${Require.resolve('./migration/a/b/20211028000056-null.js')}.uninstalled`)
  ])
})

Test.serial('Migration(\'...\')', (test) => {
  test.notThrows(() => { new Migration(MigrationPath) })
})

Test.serial('isInstalled() returns false', async (test) => {
  test.is(await (new Migration(MigrationPath)).isInstalled(), false)
})

Test.serial('isInstalled() returns true', async (test) => {

  let migration = new Migration(MigrationPath)

  await migration.install()

  try {
    test.is(await migration.isInstalled(), true)
  } finally {
    await migration.uninstall()
  }

})
 
Test.serial('isNotInstalled() returns true', async (test) => {
  test.is(await (new Migration(MigrationPath)).isNotInstalled(), true)
})

Test.serial('isNotInstalled() returns false', async (test) => {

  let migration = new Migration(MigrationPath)

  await migration.install()

  try {
    test.is(await migration.isNotInstalled(), false)
  } finally {
    await migration.uninstall()
  }

})

Test.serial('install()', async (test) => {

  let migration = new Migration(MigrationPath)

  await test.notThrowsAsync(migration.install())

  try {
    test.is(await migration.isInstalled(), true)
  } finally {
    await migration.uninstall()
  }

})

Test.serial('uninstall()', async (test) => {

  let migration = new Migration(MigrationPath)

  await migration.install()
  await test.notThrowsAsync(migration.uninstall())

  test.is(await migration.isInstalled(), false)

})

Test.serial('createMigration(name)', async (test) => {

  let name = 'create-migration'

  await test.notThrowsAsync(Migration.createMigration(name))

  let folderPath = Path.normalize(`${FolderPath}/../../../source/test/library/migration`)
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

Test.serial('getMigration()', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration()

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 4)
    test.is(migration[0].name, '20211027025141-initial')
    test.is(migration[1].name, '20211027235941-null')
    test.is(migration[2].name, '20211028000015-null')
    test.is(migration[3].name, '20211028000056-null')

  })
})

Test.serial('importMigration(\'...\')', (test) => {
  return test.notThrowsAsync(async () => {
    test.is((await Migration.importMigration(MigrationPath)).name, '20211028000015-null')
  })
})

Test.serial('installMigration()', async (test) => {

  await test.notThrowsAsync(Migration.installMigration())

  try {

    let migration = await Migration.getMigration()

    test.is(migration.length, 4)
    test.is(await migration[0].isInstalled(), true)
    test.is(await migration[1].isInstalled(), true)
    test.is(await migration[2].isInstalled(), true)
    test.is(await migration[3].isInstalled(), true)

  } finally {
    await Migration.uninstallMigration()
  }

})

Test.serial('uninstallMigration()', async (test) => {

  await Migration.installMigration()
  await test.notThrowsAsync(Migration.uninstallMigration())

  let migration = await Migration.getMigration()

  test.is(migration.length, 4)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)
  test.is(await migration[3].isInstalled(), false)

})
