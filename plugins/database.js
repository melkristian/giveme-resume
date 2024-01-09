import fp from 'fastify-plugin'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

/**
 * This decorator exposes the lowDb connection. Note that using JSONFilePreset automatically flips to in-Memory
 * when ran with NODE_ENV=test. Use new Low(new JSONFile) instead.
 *
 * @see https://github.com/typicode/lowdb
 */

export default fp( async(fastify, opts) => {
  const filePath = new URL(`../${opts.databasePath}`, import.meta.url)
  const db = new Low(new JSONFile(filePath.pathname), [])
  await db.read()

  db.getAll = function () {
    return this.data
  }

  db.getOne = function (resumeId) {
    return this.data.find((resume) => resume.resumeId === resumeId )
  }

  fastify.decorate( 'db', db)
})