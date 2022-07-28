import { CreateRandomId, LoggedForkedProcess } from '@virtualpatterns/mablung-worker/test'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import { Path } from '@virtualpatterns/mablung-path'
import Test from 'ava'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js/, '')

Test.before(() => {
  return FileSystem.emptyDir(DataPath)
})

Test.beforeEach(async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  test.context.logPath = logPath

  // test.log(`test.context.logPath = '${Path.relative('', test.context.logPath)}'`)

})

Test('list', async (test) => {
  test.is(await (new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), { 'list': true }, { 'cwd': Path.resolve(FolderPath, 'js-migration') })).whenExit(), 0)
})
