import { CreateMigration, Migration as BaseMigration } from '@virtualpatterns/mablung-migration'
import Path from 'path'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const Migration = CreateMigration(BaseMigration, Path.normalize(`${FolderPath}/../../../source/test/library/migration`), Path.normalize(`${FolderPath}/../../../source/library/migration/template.js`), `${FolderPath}/migration`)

export { Migration }