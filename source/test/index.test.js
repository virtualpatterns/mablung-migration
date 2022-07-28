import Test from 'ava'

;[
  'Migration',
  'CreateMigration'
].forEach((name) => {

  Test(name, async (test) => {
    test.truthy(await import('@virtualpatterns/mablung-migration').then((module) => module[name]))
  })
  
})
