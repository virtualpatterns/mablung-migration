import { Path } from '@virtualpatterns/mablung-path'
import Test from 'ava'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

Test('Template', (test) => {
  return test.notThrowsAsync(async () => { 

    let path = Path.resolve(FolderPath, './file-system-migration/template.js')

    let Template = await import(path).then((module) => module.default)
    let template = new Template({ 'install': { 'path': '' }}) 

    test.is(template.path, path)

  })
})
