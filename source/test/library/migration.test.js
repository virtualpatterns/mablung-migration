import { FileSystem } from '@virtualpatterns/mablung-file-system'
import Match from 'minimatch'
import Path from 'path'
import Test from 'ava'

import { Migration } from './migration.js'
import { Migration as NullMigration } from './migration/1638155586903-null.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)
const Require = __require

const InstallPath = 'data/migration/library'

Test.beforeEach(async () => {
  await FileSystem.remove(InstallPath)
  return FileSystem.ensureDir(InstallPath)
})

Test.serial('Migration(\'...\')', (test) => {
  test.notThrows(() => { new NullMigration(InstallPath) })
})

Test.serial('isInstalled() returns false', async (test) => {
  test.is(await (new NullMigration(InstallPath)).isInstalled(), false)
})

Test.serial('isInstalled() returns true', async (test) => {

  let migration = new NullMigration(InstallPath)

  await migration.install()
  test.is(await migration.isInstalled(), true)

})

Test.serial('install()', (test) => {
  return test.notThrowsAsync((new NullMigration(InstallPath)).install())
})

Test.serial('uninstall()', async (test) => {
  return test.notThrowsAsync((new NullMigration(InstallPath)).uninstall())
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

Test.serial('importMigration(\'...\')', (test) => {
  return test.notThrowsAsync(async () => {
    test.is((await Migration.importMigration(Require.resolve('./migration/1638155586903-null.js'), InstallPath)).name, '1638155586903-null')
  })
})

Test.serial('getMigration(default, default)', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration(
      Migration.defaultFrom,
      Migration.defaultFrom,
      InstallPath
    )

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 3)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')
    test.is(migration[2].name, '1638155612638-null')

  })
})

Test.serial('getMigration(..., default)', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration(
      1638155600628,
      Migration.defaultFrom,
      InstallPath
    )

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155600628-null')
    test.is(migration[1].name, '1638155612638-null')

  })
})

Test.serial('getMigration(..., ...)', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration(
      1638155600628,
      1638155600628,
      InstallPath
    )

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 1)
    test.is(migration[0].name, '1638155600628-null')

  })
})

Test.serial('getMigration(default, ...)', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration(
      Migration.defaultFrom,
      1638155600628,
      InstallPath
    )

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')

  })
})

Test.serial('getMigration(\'...\', default)', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration(
      Require.resolve('./migration/a/1638155600628-null.js'),
      Migration.defaultFrom,
      InstallPath
    )

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
      Require.resolve('./migration/a/1638155600628-null.js'),
      InstallPath
    )

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 1)
    test.is(migration[0].name, '1638155600628-null')

  })
})

Test.serial('getMigration(default, \'...\')', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration(
      Migration.defaultFrom,
      Require.resolve('./migration/a/1638155600628-null.js'),
      InstallPath
    )

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')

  })
})

Test.serial('installMigration(defaut, default)', async (test) => {

  await test.notThrowsAsync(Migration.installMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('installMigration(..., default)', async (test) => {

  await test.notThrowsAsync(Migration.installMigration(1638155600628, Migration.defaultTo, InstallPath))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('installMigration(..., ...)', async (test) => {

  await test.notThrowsAsync(Migration.installMigration(1638155600628, 1638155600628, InstallPath))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('installMigration(default, ...)', async (test) => {

  await test.notThrowsAsync(Migration.installMigration(Migration.defaultFrom, 1638155600628, InstallPath))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('installMigration(\'...\', default)', async (test) => {

  await test.notThrowsAsync(Migration.installMigration(
    Require.resolve('./migration/a/1638155600628-null.js'),
    Migration.defaultFrom,
    InstallPath
  ))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('installMigration(\'...\', \'...\')', async (test) => {

  await test.notThrowsAsync(Migration.installMigration(
    Require.resolve('./migration/a/1638155600628-null.js'),
    Require.resolve('./migration/a/1638155600628-null.js'),
    InstallPath
  ))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('installMigration(default, \'...\')', async (test) => {

  await test.notThrowsAsync(Migration.installMigration(
    Migration.defaultFrom,
    Require.resolve('./migration/a/1638155600628-null.js'),
    InstallPath
  ))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration(default, default)', async (test) => {

  await Migration.installMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)
  await test.notThrowsAsync(Migration.uninstallMigration(
    Migration.defaultFrom,
    Migration.defaultFrom,
    InstallPath
  ))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration(..., default)', async (test) => {

  await Migration.installMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)
  await test.notThrowsAsync(Migration.uninstallMigration(
    1638155600628,
    Migration.defaultFrom,
    InstallPath
  ))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration(..., ...)', async (test) => {

  await Migration.installMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)
  await test.notThrowsAsync(Migration.uninstallMigration(
    1638155600628,
    1638155600628,
    InstallPath
  ))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})


Test.serial('uninstallMigration(default, ...)', async (test) => {

  await Migration.installMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)
  await test.notThrowsAsync(Migration.uninstallMigration(
    Migration.defaultFrom,
    1638155600628,
    InstallPath
  ))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('uninstallMigration(\'...\', default)', async (test) => {

  await Migration.installMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)
  await test.notThrowsAsync(Migration.uninstallMigration(
    Require.resolve('./migration/a/1638155600628-null.js'),
    Migration.defaultFrom,
    InstallPath
  ))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration(\'...\', \'...\')', async (test) => {

  await Migration.installMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)
  await test.notThrowsAsync(Migration.uninstallMigration(
    Require.resolve('./migration/a/1638155600628-null.js'),
    Require.resolve('./migration/a/1638155600628-null.js'),
    InstallPath
  ))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('uninstallMigration(default, \'...\')', async (test) => {

  await Migration.installMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)
  await test.notThrowsAsync(Migration.uninstallMigration(
    Migration.defaultFrom,
    Require.resolve('./migration/a/1638155600628-null.js'),
    InstallPath
  ))

  let migration = await Migration.getMigration(Migration.defaultFrom, Migration.defaultTo, InstallPath)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})
