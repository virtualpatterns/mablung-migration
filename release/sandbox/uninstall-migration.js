import '@virtualpatterns/mablung-source-map-support/install';

import { Migration } from '../index.js';

async function main() {

  try {
    await Migration.uninstallMigration();
  } catch (error) {
    console.error(error);
  }

}

main();

//# sourceMappingURL=uninstall-migration.js.map