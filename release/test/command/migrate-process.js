import { createRequire as _createRequire } from "module";import { Configuration } from '@virtualpatterns/mablung-configuration';
import { FileSystem } from '@virtualpatterns/mablung-file-system';
import { ForkedProcess } from '@virtualpatterns/mablung-worker';
import Path from 'path';

const Require = _createRequire(import.meta.url);

class MigrateProcess extends ForkedProcess {

  constructor(parameter = {}, option = {}) {
    super(Require.resolve('../../command/migrate.js'), parameter, option);

    let path = 'process/log/migrate-process.log';
    FileSystem.ensureDirSync(Path.dirname(path));

    this.writeTo(path);

  }

  get _defaultParameter() {
    return Configuration.merge(
    super._defaultParameter,
    { '--migration-class-path': Require.resolve('./migration.js') },
    { '--migration-export-name': 'Migration' });
  }

  whenExit() {

    return new Promise((resolve) => {

      let onExit = null;

      this.on('exit', onExit = (code) => {

        this.off('exit', onExit);
        onExit = null;

        resolve(code);

      });

    });

  }}



export { MigrateProcess };

//# sourceMappingURL=migrate-process.js.map