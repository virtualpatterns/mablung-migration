
export function CreateMigration(migrationClass, defaultSourceMigrationPath, defaultSourceTemplatePath, defaultReleaseMigrationPath/*, defaultIncludePattern = [ '*.js' ], defaultExcludePattern = [ 'template.js' ] */) {
 
  class Migration extends migrationClass {

    constructor(...argument) {
      super(...argument)
    }

    static createMigration(name, migrationPath = defaultSourceMigrationPath, templatePath = defaultSourceTemplatePath) {
      return super.createMigration(name, migrationPath, templatePath)
    }

    static getRawMigration(...argument) {
      return [...super.getRawMigration(...argument), ...super.getRawMigrationFromPath(defaultReleaseMigrationPath, /* defaultIncludePattern, defaultExcludePattern, */ ...argument)  ]
    }

  }

  return Migration

}
