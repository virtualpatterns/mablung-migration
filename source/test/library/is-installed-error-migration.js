import { CreateMigration, Migration } from '@virtualpatterns/mablung-migration'
import { Path } from '@virtualpatterns/mablung-path'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

export const IsInstalledErrorMigration = CreateMigration(Migration, Path.resolve(FolderPath, 'is-installed-error-migration'))
