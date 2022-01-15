import { Configuration } from '@virtualpatterns/mablung-configuration'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import Is from '@pwn/is'
import Path from 'path'

import { MigrationConfigurationInvalidError } from './error/migration-configuration-invalid-error.js'

export async function LoadConfiguration(path) {

  let defaultConfiguration = {
    'migration': {
      'name': 'Migration',
      'path': './release/library/migration.js'
    }
  }

  let userConfiguration = null

  if (Is.undefined(path)) { 

    path = [ './migration.js', './migration.json' ]
    
    let pathExists = null
    pathExists = await Promise.all(path.map((path) => FileSystem.pathExists(Path.resolve(path))))

    path = path.filter((path, index) => pathExists[index])
    
    if (Is.equal(path.length, 0)) {
      throw new MigrationConfigurationInvalidError([ './migration.js', './migration.json' ])
    } else {
      path = path[0]
    }

  }

  userConfiguration = await Configuration.load(path)
  userConfiguration.path = path

  return Configuration.merge(defaultConfiguration, userConfiguration)

}
