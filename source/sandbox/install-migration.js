import '@virtualpatterns/mablung-source-map-support/install'

import { Migration } from '../index.js'

const Process = process

async function main() {

  Process.exitCode = 0

  try {
    console.log('hi')
  } catch (error) {
    Process.exitCode = 1
    console.error(error)
  }

}

main()