import { CreateMigration, Migration } from '@virtualpatterns/mablung-migration'
import Path from 'path'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

export const UnInstallErrorMigration = CreateMigration(Migration, Path.resolve(FolderPath, './uninstall-error-migration'))
