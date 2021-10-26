import Path from 'path'

import { CreateMigration, Migration as BaseMigration } from '../../index.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const Migration = CreateMigration(BaseMigration, Path.normalize(`${FolderPath}/../../../source/test/library/migration`), Path.normalize(`${FolderPath}/../../../source/test/library/migration/template.js`), `${FolderPath}/migration`)

export { Migration }