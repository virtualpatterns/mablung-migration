import { CreateMigration, Migration } from '@virtualpatterns/mablung-migration'
import Path from 'path'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

export const InstallErrorMigration = CreateMigration(Migration, Path.resolve(FolderPath, './install-error-migration'))
