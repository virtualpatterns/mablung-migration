import Test from 'ava'

import NullMigration from './uninstall-error-migration/1642081620359-null.js'

Test.serial('uninstall() throws Error', async (test) => {
  return test.throwsAsync((new NullMigration({})).uninstall(), { 'instanceOf': Error })
})
