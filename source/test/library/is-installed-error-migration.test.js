import Test from 'ava'

import NullMigration from './is-installed-error-migration/1641991145083-null.js'

Test.serial('isInstalled() throws Error', async (test) => {
  return test.throwsAsync((new NullMigration({})).isInstalled(), { 'instanceOf': Error })
})
