import '@virtualpatterns/mablung-source-map-support/install';

import { Migration } from '../index.js';

async function main() {

  try {

    for (let migration of await Migration.getMigration()) {
      console.log(`'${migration.name}' is ${(await migration.isInstalled()) ? '' : 'NOT '}installed`);
    }

  } catch (error) {
    console.error(error);
  }

}

main();

//# sourceMappingURL=list-migration.js.map