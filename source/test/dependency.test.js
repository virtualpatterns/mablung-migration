import { Check } from '@virtualpatterns/mablung-check-dependency'
import { FileSystem } from '@virtualpatterns/mablung-file-system'
import Path from 'path'
import Test from 'ava'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

Test('default', async (test) => {

  // because the resolver package includes an invalid package.json ...
  let pathFrom = Path.resolve(FolderPath, '../../node_modules/resolve/test/resolver/malformed_package_json/package.json')
  let pathTo = Path.resolve(FolderPath, '../../node_modules/resolve/test/resolver/malformed_package_json/package.json.backup')

  /* c8 ignore next 6 */
  if (await FileSystem.pathExists(pathFrom)) {
    await FileSystem.move(pathFrom, pathTo, { 'overwrite': true })
    test.log(`'${Path.relative('', pathFrom)}' renamed to '${Path.basename(pathTo)}'`)
  } else {
    test.log(`'${Path.relative('', pathFrom)}' does not exist!`)
  }

  let dependency = await Check()

  // test.log(dependency)
  test.deepEqual(dependency.missing, {})
  test.deepEqual(dependency.unused, [])

})
