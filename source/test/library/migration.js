import { CreateMigration } from '@virtualpatterns/mablung-migration'
import Path from 'path'

import { Migration as BaseMigration } from '../migration.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const Migration = CreateMigration(BaseMigration, Path.normalize(`${FolderPath}/../../../source/test/library/migration`), Path.normalize(`${FolderPath}/../../../source/library/migration/template.js`), `${FolderPath}/migration`)

export { Migration }