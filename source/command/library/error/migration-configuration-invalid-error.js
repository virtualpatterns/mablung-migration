import Is from '@pwn/is'

import { MigrationError } from './migration-error.js'

class MigrationConfigurationInvalidError extends MigrationError {

  constructor(path) {
    super(`The configurations ${Is.array(path) ? `'${path.join('\', \'')}'` : `'${path}'` } are invalid or do not exist.`)
  }

}

export { MigrationConfigurationInvalidError }
