import { JSONFilePreset } from 'lowdb/node'
import { Command } from 'commander'
import createResume from './mock-resumes.js'

// Setup Command for command line options
function setupCommandLine() {
  const script = new Command()
  script.option('-t, --target <string>', 'json file output location relative to the location of populate-db.js')
  script.option('-n, --count <number>', 'number of entries to generate', (n) => parseInt(n), 1)
  script.option('-c, --country <string>', 'three-letter country code. defaults to \'USA\'. use \'any\' for random country codes')
  script.option('-a, --append', 'if provided, data will be added to existing data, otherwise, it will overwrite')
  script.parse()
  return script.opts()
}

// Generate resumes
function createData(options = {}) {
  let resumes = [];

  if (options.count && options.count > 0) {
    for(let i = 1; i <= options.count; i++){
      resumes.push(createResume(options, i))
    }
  }

  return resumes
}


async function populateDatabase(options = {}){
  const filePath = new URL(options.target || '../data/db.json', import.meta.url)
  const db = await JSONFilePreset(filePath.pathname, [])
  const newData = createData(options)

  if(options.append) {
    db.data = db.data.concat(newData)
  } else {
    db.data = newData
  }

  await db.write()

  console.info('\n------------------------')
  console.info('Resumes generated: ', newData.length)
  console.info('Location: ', filePath.pathname)
  console.info('------------------------\n')
}

const options = setupCommandLine()
await populateDatabase(options)