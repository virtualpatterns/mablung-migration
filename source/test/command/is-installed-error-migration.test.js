import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import { ForkedProcess } from '@virtualpatterns/mablung-worker'
import Path from 'path'
import Test from 'ava'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const DataPath = FilePath.replace('/release/', '/data/').replace('.test.js', '')
const LogPath = DataPath.concat('.log')
const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test.serial('list throws Error', async (test) => {

  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), {
    '--configuration-path': Path.resolve(FolderPath, './is-installed-error-migration.json'),
    'list': true
  })

  test.is(await process.whenExit(), 1)

})
