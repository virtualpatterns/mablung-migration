import { Migration as BaseMigration } from '../migration.js'

class Migration extends BaseMigration {

  constructor(path) {
    super(path)
  }

  install() {
    return super.install()
  }

  uninstall() {
    return super.uninstall()
  }

}

export { Migration }
