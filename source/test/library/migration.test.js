import { FileSystem } from '@virtualpatterns/mablung-file-system'
import Match from 'minimatch'
import Path from 'path'
import Test from 'ava'

import { Migration } from './migration.js'
import { Migration as NullMigration } from './migration/1638155586903-null.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)
const Require = __require

Test.beforeEach(() => {
  return Promise.all([
    FileSystem.remove(`${FolderPath}/migration/1638155586903-null.js.installed`),
    FileSystem.remove(`${FolderPath}/migration/1638155586903-null.js.uninstalled`),
    FileSystem.remove(`${FolderPath}/migration/a/1638155600628-null.js.installed`),
    FileSystem.remove(`${FolderPath}/migration/a/1638155600628-null.js.uninstalled`),
    FileSystem.remove(`${FolderPath}/migration/a/b/1638155612638-null.js.installed`),
    FileSystem.remove(`${FolderPath}/migration/a/b/1638155612638-null.js.uninstalled`)
  ])
})

Test.serial('Migration()', (test) => {
  test.notThrows(() => { new NullMigration() })
})

Test.serial('Migration(\'...\')', (test) => {
  test.notThrows(() => { new NullMigration(Require.resolve('./migration/1638155586903-null.js')) })
})

Test.serial('isInstalled() returns false', async (test) => {
  test.is(await (new NullMigration()).isInstalled(), false)
})

Test.serial('isInstalled() returns true', async (test) => {

  let migration = new NullMigration()

  await migration.install()

  try {
    test.is(await migration.isInstalled(), true)
  } finally {
    await migration.uninstall()
  }

})
 
Test.serial('isNotInstalled() returns true', async (test) => {
  test.is(await (new NullMigration()).isNotInstalled(), true)
})

Test.serial('isNotInstalled() returns false', async (test) => {

  let migration = new NullMigration()

  await migration.install()

  try {
    test.is(await migration.isNotInstalled(), false)
  } finally {
    await migration.uninstall()
  }

})

Test.serial('install()', async (test) => {

  let migration = new NullMigration()

  await test.notThrowsAsync(migration.install())

  try {
    test.is(await migration.isInstalled(), true)
  } finally {
    await migration.uninstall()
  }

})

Test.serial('uninstall()', async (test) => {

  let migration = new NullMigration()

  await migration.install()
  await test.notThrowsAsync(migration.uninstall())

  test.is(await migration.isInstalled(), false)

})

Test.serial('createMigration(\'...\')', async (test) => {

  let name = 'create-migration'

  await test.notThrowsAsync(Migration.createMigration(name))

  let folderPath = Path.normalize(`${FolderPath}/../../../source/test/library/migration`)
  let pattern = `*-${name}.js`

  let item = await FileSystem.readdir(folderPath, { 'encoding': 'utf-8', 'withFileTypes': true })
  let path = item
    .filter((item) => item.isFile())
    .filter((file) => Match(file.name, pattern))
    .map((file) => `${folderPath}/${file.name}`)

  test.log(Path.relative('', path[0]))
  test.is(path.length, 1)

  await FileSystem.remove(path[0])

})

Test.serial('getMigration()', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration()

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 3)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')
    test.is(migration[2].name, '1638155612638-null')

  })
})

Test.serial('getMigration(...)', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration(1638155600628)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155600628-null')
    test.is(migration[1].name, '1638155612638-null')

  })
})

Test.serial('getMigration(..., ...)', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration(1638155600628, 1638155600628)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 1)
    test.is(migration[0].name, '1638155600628-null')

  })
})

Test.serial('getMigration(\'...\')', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration(Require.resolve('./migration/a/1638155600628-null.js'))

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155600628-null')
    test.is(migration[1].name, '1638155612638-null')

  })
})

Test.serial('getMigration(\'...\', \'...\')', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration(
      Require.resolve('./migration/a/1638155600628-null.js'),
      Require.resolve('./migration/a/1638155600628-null.js'))

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 1)
    test.is(migration[0].name, '1638155600628-null')

  })
})

Test.serial('importMigration(\'...\')', (test) => {
  return test.notThrowsAsync(async () => {
    test.is((await Migration.importMigration(Require.resolve('./migration/1638155586903-null.js'))).name, '1638155586903-null')
  })
})

Test.serial('installMigration()', async (test) => {

  await test.notThrowsAsync(Migration.installMigration())

  let migration = await Migration.getMigration()

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('installMigration(...)', async (test) => {

  await test.notThrowsAsync(Migration.installMigration(1638155600628))

  let migration = await Migration.getMigration()

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('installMigration(..., ...)', async (test) => {

  await test.notThrowsAsync(Migration.installMigration(1638155600628, 1638155600628))

  let migration = await Migration.getMigration()

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('installMigration(\'...\')', async (test) => {

  await test.notThrowsAsync(Migration.installMigration(Require.resolve('./migration/a/1638155600628-null.js')))

  let migration = await Migration.getMigration()

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('installMigration(\'...\', \'...\')', async (test) => {

  await test.notThrowsAsync(Migration.installMigration(
    Require.resolve('./migration/a/1638155600628-null.js'),
    Require.resolve('./migration/a/1638155600628-null.js')))

  let migration = await Migration.getMigration()

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration()', async (test) => {

  await Migration.installMigration()
  await test.notThrowsAsync(Migration.uninstallMigration())

  let migration = await Migration.getMigration()

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration(...)', async (test) => {

  await Migration.installMigration()
  await test.notThrowsAsync(Migration.uninstallMigration(1638155600628))

  let migration = await Migration.getMigration()

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration(..., ...)', async (test) => {

  await Migration.installMigration()
  await test.notThrowsAsync(Migration.uninstallMigration(1638155600628, 1638155600628))

  let migration = await Migration.getMigration()

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('uninstallMigration(\'...\')', async (test) => {

  await Migration.installMigration()
  await test.notThrowsAsync(Migration.uninstallMigration(Require.resolve('./migration/a/1638155600628-null.js')))

  let migration = await Migration.getMigration()

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration(\'...\', \'...\')', async (test) => {

  await Migration.installMigration()
  await test.notThrowsAsync(Migration.uninstallMigration(
    Require.resolve('./migration/a/1638155600628-null.js'),
    Require.resolve('./migration/a/1638155600628-null.js')))

  let migration = await Migration.getMigration()

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})
