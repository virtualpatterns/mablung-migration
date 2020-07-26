import '@virtualpatterns/mablung-source-map-support/install.js'
import Command from 'commander'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import JSON5 from 'json5'

import { Migration } from '../index.js'

const Process = process
const Require = __require

const Package = JSON5.parse(FileSystem.readFileSync(Require.resolve('../../package.json'), { 'encoding': 'utf-8' }))

Command.version(Package.version)
Command.description('Create a migration with the given name in the \'source/library/migration\' folder')
Command.arguments('<name>')
Command.action(async (name) => {

  try {
    await Migration.createMigration(name)
  } catch (error) {
    console.error(error)
  }

})

Command.parse(Process.argv)
