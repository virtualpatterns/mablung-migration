
export function CreateMigration(migrationClass, defaultReleaseMigrationPath, defaultSourceMigrationPath = defaultReleaseMigrationPath.replace('/release/', '/source/'), defaultSourceTemplatePath) {
 
  class Migration extends migrationClass {

    constructor(...argument) {
      super(...argument)
    }

    static createMigration(name, migrationPath = defaultSourceMigrationPath, templatePath = defaultSourceTemplatePath) {
      return super.createMigration(name, migrationPath, templatePath)
    }

    static getRawMigration(option) {
      return [ ...super.getRawMigration(option), ...super.getRawMigrationFromPath(defaultReleaseMigrationPath, option) ]
    }

  }

  return Migration

}
