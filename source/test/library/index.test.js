import Test from 'ava'

;[
  'FileSystemMigration'
].forEach((name) => {

  Test(name, async (test) => {
    test.truthy(await import('@virtualpatterns/mablung-migration/test').then((module) => module[name]))
  })
  
})
