import '@virtualpatterns/mablung-source-map-support/install';

import { Migration } from '../index.js';

async function main() {

  try {
    await Migration.installMigration();
  } catch (error) {
    console.error(error);
  }

}

main();

//# sourceMappingURL=install-migration.js.map