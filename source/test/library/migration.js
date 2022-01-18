import { CreateMigration } from '@virtualpatterns/mablung-migration'
import { FileSystemMigration } from '@virtualpatterns/mablung-migration/test'
import Path from 'path'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

export const Migration = CreateMigration(FileSystemMigration, Path.resolve(FolderPath, './migration'))
