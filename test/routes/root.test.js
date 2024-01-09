import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper.js'

test('Default root route should redirect to /resume', async (t) => {
  const app = await build(t)
  const res = await app.inject({
    url: '/'
  })

  assert.equal(res.statusCode, 302)
  assert.equal(res.headers.location, '/resume')
})
