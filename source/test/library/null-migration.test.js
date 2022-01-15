import { Configuration } from '@virtualpatterns/mablung-configuration'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import Path from 'path'
import Test from 'ava'

import { NullMigration } from './null-migration.js'

import Migration from './null-migration/1638155586903-null.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const Option = {
  'install': {
    'path': FilePath.replace('/release/', '/data/').replace('.test.js', '')
  }
}

Test.beforeEach(async () => {
  await FileSystem.remove(Option.install.path)
  return FileSystem.ensureDir(Option.install.path)
})

Test.serial('NullMigration({ ... })', (test) => {
  test.notThrows(() => { new Migration(Option) })
})

Test.serial('isInstalled() returns false when the migration is not installed', async (test) => {
  test.is(await (new Migration(Option)).isInstalled(), false)
})

Test.serial('isInstalled() returns true when the migration is installed', async (test) => {

  let migration = new Migration(Option)

  await migration.install()
  test.is(await migration.isInstalled(), true)

})

Test.serial('isInstalled() returns false when the migration is uninstalled', async (test) => {

  let migration = new Migration(Option)

  await migration.install()
  await migration.uninstall()
  test.is(await migration.isInstalled(), false)

})

Test.serial('isInstalled() returns true when the migration is reinstalled', async (test) => {

  let migration = new Migration(Option)

  await migration.install()
  await migration.uninstall()
  await migration.install()
  test.is(await migration.isInstalled(), true)

})

Test.serial('isInstalled() returns false when the migration is reuninstalled', async (test) => {

  let migration = new Migration(Option)

  await migration.install()
  await migration.uninstall()
  await migration.install()
  await migration.uninstall()
  test.is(await migration.isInstalled(), false)

})

Test.serial('install()', (test) => {
  return test.notThrowsAsync((new Migration(Option)).install())
})

Test.serial('install() when reinstalled', async (test) => {

  let migration = new Migration(Option)

  await migration.install()
  return test.notThrowsAsync(migration.install())
  
})

Test.serial('uninstall()', async (test) => {
  return test.notThrowsAsync((new Migration(Option)).uninstall())
})

Test.serial('uninstall() when reuninstalled', async (test) => {

  let migration = new Migration(Option)

  await migration.install()
  await migration.uninstall()
  return test.notThrowsAsync(migration.uninstall())

})

Test.serial('createMigration(\'...\')', async (test) => {

  let name = `create-migration-for-${Path.basename(FilePath, Path.extname(FilePath)).replace('.test', '')}`

  await test.notThrowsAsync(async () => {
    
    let path = await NullMigration.createMigration(name)

    try {
      test.true(await FileSystem.pathExists(path))
    } finally {
      await FileSystem.remove(path)
    }

  })

})

Test.serial('getMigration({ ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await NullMigration.getMigration(Option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 3)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')
    test.is(migration[2].name, '1638155612638-null')

  })
})

Test.serial('getMigration({ from: ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption(Option, { 'include': { 'from': 1638155600628 } })
    let migration = await NullMigration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155600628-null')
    test.is(migration[1].name, '1638155612638-null')

  })
})

Test.serial('getMigration({ from: ..., to: ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption(Option, { 'include': { 'from': 1638155600628, 'to': 1638155600628 } })
    let migration = await NullMigration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 1)
    test.is(migration[0].name, '1638155600628-null')

  })
})

Test.serial('getMigration({ to: ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption(Option, { 'include': { 'to': 1638155600628 } })
    let migration = await NullMigration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')

  })
})

Test.serial('getMigration({ from: \'...\' })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption(Option, { 'include': { 'from': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js') } })
    let migration = await NullMigration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155600628-null')
    test.is(migration[1].name, '1638155612638-null')

  })
})

Test.serial('getMigration({ from: \'...\', to: \'...\' })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption(Option, { 'include': { 'from': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js'), 'to': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js') } })
    let migration = await NullMigration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 1)
    test.is(migration[0].name, '1638155600628-null')

  })
})

Test.serial('getMigration({ to: \'...\' })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption(Option, { 'include': { 'to': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js') } })
    let migration = await NullMigration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')

  })
})

Test.serial('getMigration({ from: (non-migration), to: (non-migration) })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption(Option, { 'include': { 'from': Path.resolve(FolderPath, '../../library/migration-0/template.js'), 'to': Path.resolve(FolderPath, '../../library/migration-0/template.js') } })
    let migration = await NullMigration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 3)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')
    test.is(migration[2].name, '1638155612638-null')

  })
})

Test.serial('onMigration(( ... ) => { ... }, { ... })', (test) => { 

  test.plan(3)

  return NullMigration.onMigration(async (migration) => {
    test.is(await migration.isInstalled(), false)
  }, Option)

})

Test.serial('installMigration({ ... })', async (test) => {

  await test.notThrowsAsync(NullMigration.installMigration(Option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('installMigration({ from: ... })', async (test) => {

  let option = Configuration.getOption(Option, { 'include': { 'from': 1638155600628 } })
  await test.notThrowsAsync(NullMigration.installMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('installMigration({ from: ..., to: ... })', async (test) => {

  let option = Configuration.getOption(Option, { 'include': { 'from': 1638155600628, 'to': 1638155600628 } })
  await test.notThrowsAsync(NullMigration.installMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('installMigration({ to: ... })', async (test) => {

  let option = Configuration.getOption(Option, { 'include': { 'to': 1638155600628 } })
  await test.notThrowsAsync(NullMigration.installMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('installMigration({ from: \'...\' })', async (test) => {

  let option = Configuration.getOption(Option, { 'include': { 'from': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js') } })
  await test.notThrowsAsync(NullMigration.installMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('installMigration({ from: \'...\', to: \'...\' })', async (test) => {

  let option = Configuration.getOption(Option, { 'include': { 'from': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js'), 'to': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js') } })
  await test.notThrowsAsync(NullMigration.installMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('installMigration({ to: \'...\' })', async (test) => {

  let option = Configuration.getOption(Option, { 'include': { 'to': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js') } })
  await test.notThrowsAsync(NullMigration.installMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration({ ... })', async (test) => {

  await NullMigration.installMigration(Option)
  await test.notThrowsAsync(NullMigration.uninstallMigration(Option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration({ from: ... })', async (test) => {

  await NullMigration.installMigration(Option)
  
  let option = Configuration.getOption(Option, { 'include': { 'from': 1638155600628 } })
  await test.notThrowsAsync(NullMigration.uninstallMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration({ from: ..., to: ... })', async (test) => {

  await NullMigration.installMigration(Option)

  let option = Configuration.getOption(Option, { 'include': { 'from': 1638155600628, 'to': 1638155600628 } })
  await test.notThrowsAsync(NullMigration.uninstallMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('uninstallMigration({ to: ... })', async (test) => {

  await NullMigration.installMigration(Option)

  let option = Configuration.getOption(Option, { 'include': { 'to': 1638155600628 } })
  await test.notThrowsAsync(NullMigration.uninstallMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('uninstallMigration({ from: \'...\' })', async (test) => {

  await NullMigration.installMigration(Option)

  let option = Configuration.getOption(Option, { 'include': { 'from': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js') } })
  await test.notThrowsAsync(NullMigration.uninstallMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), false)

})

Test.serial('uninstallMigration({ from: \'...\', to: \'...\' })', async (test) => {

  await NullMigration.installMigration(Option)

  let option = Configuration.getOption(Option, { 'include': { 'from': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js'), 'to': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js') } })
  await test.notThrowsAsync(NullMigration.uninstallMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})

Test.serial('uninstallMigration({ to: \'...\' })', async (test) => {

  await NullMigration.installMigration(Option)

  let option = Configuration.getOption(Option, { 'include': { 'to': Path.resolve(FolderPath, './migration-0/a/1638155600628-null.js') } })
  await test.notThrowsAsync(NullMigration.uninstallMigration(option))

  let migration = await NullMigration.getMigration(Option)

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), false)
  test.is(await migration[1].isInstalled(), false)
  test.is(await migration[2].isInstalled(), true)

})
