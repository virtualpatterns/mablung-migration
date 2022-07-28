import { FileSystem } from '@virtualpatterns/mablung-file-system'
import { Path } from '@virtualpatterns/mablung-path'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

export const Package = FileSystem.readJsonSync(Path.resolve(FolderPath, '../../../package.json'), { 'encoding': 'utf-8' })
