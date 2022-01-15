import Test from 'ava'

import NullMigration from './install-error-migration/1642079391068-null.js'

Test.serial('install() throws Error', async (test) => {
  return test.throwsAsync((new NullMigration({})).install(), { 'instanceOf': Error })
})
