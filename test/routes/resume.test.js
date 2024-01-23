import { test, describe } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper.js'
import Ajv from 'ajv'

describe('/resume endpoint', () => {
  test('/resume should return a collection', async (t) => {
    const app = await build(t)
    const res = await app.inject({
      method: 'GET',
      url: '/resume'
    })
    const parsedResPayload = JSON.parse(res.payload)

    assert.ok(Array.isArray(parsedResPayload))
    assert.ok(parsedResPayload.length === 1)
  })

  test('/resume should filter the response shape', async (t) => {
    const jv = new Ajv({ allErrors: true })
    const app = await build(t)
    const res = await app.inject({
      method: 'GET',
      url: '/resume'
    })
    const parsedResPayload = JSON.parse(res.payload)

    // Schemas don't seem to be easily accessible going through this test helper app initialization
    const resumeShape = {
      type: 'object',
      properties: {
        resumeId: {
          type: 'string'
        },
        name: {
          type: 'string'
        },
        hello: {
          type: 'string'
        },
        contact: {
          type: 'object',
          additionalProperties: true
        },
        photo: {
          type: 'string'
        }
      },
      additionalProperties: false
    }
    const validate = jv.compile(resumeShape)

    assert.ok(validate(parsedResPayload[0]))
  })

  test('/resume/:resumeId should return a single resume', async (t) => {
    const app = await build(t)
    const resumeId = '603af822738671'
    const res = await app.inject({
      method: 'GET',
      url: `/resume/${resumeId}`
    })
    const data = res.json()
    assert.equal(res.statusCode, 200)
    assert.equal(data?.resumeId, resumeId)
  })

  test('/resume/:resumeId should return a "Not Found" error if Resume ID does not exist', async (t) => {
    const app = await build(t)
    const resumeId = 'not-found-id'
    const res = await app.inject({
      method: 'GET',
      url: `/resume/${resumeId}`
    })
    const data = res.json()
    assert.equal(res.statusCode, 404)
    assert.equal(data.message, 'Resume ID does not exist.')
  })
})