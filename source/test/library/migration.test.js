import { Configuration } from '@virtualpatterns/mablung-configuration'
import { CreateRandomId } from '@virtualpatterns/mablung-worker/test'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import { Path } from '@virtualpatterns/mablung-path'
import Test from 'ava'

import { Migration } from './migration.js'

import NullMigration from './migration/1638155586903-null.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js/, '')

// const Option = {
//   'install': {
//     'path': FilePath.replace('/release/', '/data/').replace(/\.test\.c?js/, '')
//   }
// }

Test.before(() => {
  return FileSystem.emptyDir(DataPath)
})

Test.beforeEach(async (test) => {

  let id = await CreateRandomId()
  let installPath = Path.resolve(DataPath, `${id}`)

  test.context.installPath = installPath

  // test.log(`test.context.installPath = '${Path.relative('', test.context.installPath)}'`)

})

Test('Migration({ ... })', (test) => {
  test.notThrows(() => { new NullMigration({ 'install': { 'path': test.context.installPath }}) })
})

Test('isInstalled() returns false when the migration is not installed', async (test) => {
  test.is(await (new NullMigration({ 'install': { 'path': test.context.installPath }})).isInstalled(), false)
})

Test('isInstalled() returns true when the migration is installed', async (test) => {

  let migration = new NullMigration({ 'install': { 'path': test.context.installPath }})

  await migration.install()
  test.is(await migration.isInstalled(), true)

})

Test('isInstalled() returns false when the migration is uninstalled', async (test) => {

  let migration = new NullMigration({ 'install': { 'path': test.context.installPath }})

  await migration.install()
  await migration.uninstall()
  test.is(await migration.isInstalled(), false)

})

Test('isInstalled() returns true when the migration is reinstalled', async (test) => {

  let migration = new NullMigration({ 'install': { 'path': test.context.installPath }})

  await migration.install()
  await migration.uninstall()
  await migration.install()
  test.is(await migration.isInstalled(), true)

})

Test('isInstalled() returns false when the migration is reuninstalled', async (test) => {

  let migration = new NullMigration({ 'install': { 'path': test.context.installPath }})

  await migration.install()
  await migration.uninstall()
  await migration.install()
  await migration.uninstall()
  test.is(await migration.isInstalled(), false)

})

Test('install()', (test) => {
  return test.notThrowsAsync((new NullMigration({ 'install': { 'path': test.context.installPath }})).install())
})

Test('install() when reinstalled', async (test) => {

  let migration = new NullMigration({ 'install': { 'path': test.context.installPath }})

  await migration.install()
  return test.notThrowsAsync(migration.install())
  
})

Test('uninstall()', async (test) => {
  return test.notThrowsAsync((new NullMigration({ 'install': { 'path': test.context.installPath }})).uninstall())
})

Test('uninstall() when reuninstalled', async (test) => {

  let migration = new NullMigration({ 'install': { 'path': test.context.installPath }})

  await migration.install()
  await migration.uninstall()
  return test.notThrowsAsync(migration.uninstall())

})

Test('createMigration(\'...\')', async (test) => {

  let name = `create-migration-for-${Path.basename(FilePath, Path.extname(FilePath)).replace('.test', '')}`

  await test.notThrowsAsync(async () => {
    
    let path = await Migration.createMigration(name)

    try {
      test.true(await FileSystem.pathExists(path))
    } finally {
      await FileSystem.remove(path)
    }

  })

})

Test('getMigration({ ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 3)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')
    test.is(migration[2].name, '1638155612638-null')

  })
})

Test('getMigration({ from: ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': 1638155600628 } })
    let migration = await Migration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155600628-null')
    test.is(migration[1].name, '1638155612638-null')

  })
})

Test('getMigration({ from: ..., to: ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': 1638155600628, 'to': 1638155600628 } })
    let migration = await Migration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 1)
    test.is(migration[0].name, '1638155600628-null')

  })
})

Test('getMigration({ to: ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'to': 1638155600628 } })
    let migration = await Migration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')

  })
})

Test('getMigration({ from: \'...\' })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js') } })
    let migration = await Migration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155600628-null')
    test.is(migration[1].name, '1638155612638-null')

  })
})

Test('getMigration({ from: \'...\', to: \'...\' })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js'), 'to': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js') } })
    let migration = await Migration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 1)
    test.is(migration[0].name, '1638155600628-null')

  })
})

Test('getMigration({ to: \'...\' })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'to': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js') } })
    let migration = await Migration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 2)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')

  })
})

Test('getMigration({ from: (non-migration), to: (non-migration) })', (test) => {
  return test.notThrowsAsync(async () => {

    let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': Path.resolve(FolderPath, '../../library/migration-0/template.js'), 'to': Path.resolve(FolderPath, '../../library/migration-0/template.js') } })
    let migration = await Migration.getMigration(option)

    // test.log(migration.map((item) => Path.relative('', item.path)))
    test.is(migration.length, 3)
    test.is(migration[0].name, '1638155586903-null')
    test.is(migration[1].name, '1638155600628-null')
    test.is(migration[2].name, '1638155612638-null')

  })
})

Test('onMigration(( ... ) => { ... }, { ... })', (test) => {

  test.plan(4)

  return test.notThrowsAsync(Migration.onMigration(async (oneMigration, index, allMigration) => {
    test.is(oneMigration, allMigration[index])
  }, { 'install': { 'path': test.context.installPath }}))

})

Test('onNotInstalledMigration(( ... ) => { ... }, { ... }) when migrations are not installed', async (test) => {

  test.plan(4)

  return test.notThrowsAsync(Migration.onNotInstalledMigration(async (oneMigration, index, allMigration) => {
    test.is(oneMigration, allMigration[index])
  }, { 'install': { 'path': test.context.installPath }}))

})

Test('onNotInstalledMigration(( ... ) => { ... }, { ... }) when migrations are installed', async (test) => {

  await Migration.installMigration({ 'install': { 'path': test.context.installPath }})

  test.plan(1)

  return test.notThrowsAsync(Migration.onNotInstalledMigration(async () => {}, { 'install': { 'path': test.context.installPath }}))

})

Test('onNotInstalledMigration(( ... ) => { ... }, { ... }) when migrations are uninstalled', async (test) => {

  await Migration.installMigration({ 'install': { 'path': test.context.installPath }})
  await Migration.uninstallMigration({ 'install': { 'path': test.context.installPath }})

  test.plan(4)

  return test.notThrowsAsync(Migration.onNotInstalledMigration(async (oneMigration, index, allMigration) => {
    test.is(oneMigration, allMigration[index])
  }, { 'install': { 'path': test.context.installPath }}))

})

Test('onInstalledMigration(( ... ) => { ... }, { ... }) when migrations are not installed', async (test) => {

  test.plan(1)

  return test.notThrowsAsync(Migration.onInstalledMigration(async () => {}, { 'install': { 'path': test.context.installPath }}))

})

Test('onInstalledMigration(( ... ) => { ... }, { ... }) when migrations are installed', async (test) => {

  await Migration.installMigration({ 'install': { 'path': test.context.installPath }})

  test.plan(4)

  return test.notThrowsAsync(Migration.onInstalledMigration(async (oneMigration, index, allMigration) => {
    test.is(oneMigration, allMigration[index])
  }, { 'install': { 'path': test.context.installPath }}))

})

Test('onInstalledMigration(( ... ) => { ... }, { ... }) when migrations are uninstalled', async (test) => {

  await Migration.installMigration({ 'install': { 'path': test.context.installPath }})
  await Migration.uninstallMigration({ 'install': { 'path': test.context.installPath }})

  test.plan(1)

  return test.notThrowsAsync(Migration.onInstalledMigration(async () => {}, { 'install': { 'path': test.context.installPath }}))

})

Test('installMigration({ ... })', async (test) => {

  await test.notThrowsAsync(Migration.installMigration({ 'install': { 'path': test.context.installPath }}))

  let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

  test.is(migration.length, 3)
  test.is(await migration[0].isInstalled(), true)
  test.is(await migration[1].isInstalled(), true)
  test.is(await migration[2].isInstalled(), true)

})

// // Test('installMigration({ from: ... })', async (test) => {

// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': 1638155600628 } })
// //   await test.notThrowsAsync(Migration.installMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), false)
// //   test.is(await migration[1].isInstalled(), true)
// //   test.is(await migration[2].isInstalled(), true)

// // })

// // Test.skip('installMigration({ from: ..., to: ... })', async (test) => {

// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': 1638155600628, 'to': 1638155600628 } })
// //   await test.notThrowsAsync(Migration.installMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), false)
// //   test.is(await migration[1].isInstalled(), true)
// //   test.is(await migration[2].isInstalled(), false)

// // })

// // Test.skip('installMigration({ to: ... })', async (test) => {

// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'to': 1638155600628 } })
// //   await test.notThrowsAsync(Migration.installMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), true)
// //   test.is(await migration[1].isInstalled(), true)
// //   test.is(await migration[2].isInstalled(), false)

// // })

// // Test.skip('installMigration({ from: \'...\' })', async (test) => {

// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js') } })
// //   await test.notThrowsAsync(Migration.installMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), false)
// //   test.is(await migration[1].isInstalled(), true)
// //   test.is(await migration[2].isInstalled(), true)

// // })

// // Test.skip('installMigration({ from: \'...\', to: \'...\' })', async (test) => {

// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js'), 'to': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js') } })
// //   await test.notThrowsAsync(Migration.installMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), false)
// //   test.is(await migration[1].isInstalled(), true)
// //   test.is(await migration[2].isInstalled(), false)

// // })

// // Test.skip('installMigration({ to: \'...\' })', async (test) => {

// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'to': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js') } })
// //   await test.notThrowsAsync(Migration.installMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), true)
// //   test.is(await migration[1].isInstalled(), true)
// //   test.is(await migration[2].isInstalled(), false)

// // })

// Test.skip('uninstallMigration({ ... })', async (test) => {

//   await Migration.installMigration({ 'install': { 'path': test.context.installPath }})
//   await test.notThrowsAsync(Migration.uninstallMigration({ 'install': { 'path': test.context.installPath }}))

//   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

//   test.is(migration.length, 3)
//   test.is(await migration[0].isInstalled(), false)
//   test.is(await migration[1].isInstalled(), false)
//   test.is(await migration[2].isInstalled(), false)

// })

// // Test.skip('uninstallMigration({ from: ... })', async (test) => {

// //   await Migration.installMigration({ 'install': { 'path': test.context.installPath }})
  
// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': 1638155600628 } })
// //   await test.notThrowsAsync(Migration.uninstallMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), true)
// //   test.is(await migration[1].isInstalled(), false)
// //   test.is(await migration[2].isInstalled(), false)

// // })

// // Test.skip('uninstallMigration({ from: ..., to: ... })', async (test) => {

// //   await Migration.installMigration({ 'install': { 'path': test.context.installPath }})

// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': 1638155600628, 'to': 1638155600628 } })
// //   await test.notThrowsAsync(Migration.uninstallMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), true)
// //   test.is(await migration[1].isInstalled(), false)
// //   test.is(await migration[2].isInstalled(), true)

// // })

// // Test.skip('uninstallMigration({ to: ... })', async (test) => {

// //   await Migration.installMigration({ 'install': { 'path': test.context.installPath }})

// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'to': 1638155600628 } })
// //   await test.notThrowsAsync(Migration.uninstallMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), false)
// //   test.is(await migration[1].isInstalled(), false)
// //   test.is(await migration[2].isInstalled(), true)

// // })

// // Test.skip('uninstallMigration({ from: \'...\' })', async (test) => {

// //   await Migration.installMigration({ 'install': { 'path': test.context.installPath }})

// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js') } })
// //   await test.notThrowsAsync(Migration.uninstallMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), true)
// //   test.is(await migration[1].isInstalled(), false)
// //   test.is(await migration[2].isInstalled(), false)

// // })

// // Test.skip('uninstallMigration({ from: \'...\', to: \'...\' })', async (test) => {

// //   await Migration.installMigration({ 'install': { 'path': test.context.installPath }})

// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'from': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js'), 'to': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js') } })
// //   await test.notThrowsAsync(Migration.uninstallMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), true)
// //   test.is(await migration[1].isInstalled(), false)
// //   test.is(await migration[2].isInstalled(), true)

// // })

// // Test.skip('uninstallMigration({ to: \'...\' })', async (test) => {

// //   await Migration.installMigration({ 'install': { 'path': test.context.installPath }})

// //   let option = Configuration.getOption({ 'install': { 'path': test.context.installPath }}, { 'include': { 'to': Path.resolve(FolderPath, 'migration-0/a/1638155600628-null.js') } })
// //   await test.notThrowsAsync(Migration.uninstallMigration(option))

// //   let migration = await Migration.getMigration({ 'install': { 'path': test.context.installPath }})

// //   test.is(migration.length, 3)
// //   test.is(await migration[0].isInstalled(), false)
// //   test.is(await migration[1].isInstalled(), false)
// //   test.is(await migration[2].isInstalled(), true)

// // })
