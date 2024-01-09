import { test, describe, beforeEach, afterEach } from 'node:test'
import * as assert from 'node:assert'
import Fastify from 'fastify'
import { config } from '../helper.js'
import Database from '../../plugins/database.js'

describe('Database decorator', () => {
  let fastify

  beforeEach(async () => {
    fastify = Fastify()
    fastify.register(Database, config())
    await fastify.ready()
  })

  afterEach(() => fastify.close())

  test('should have a getAll function', async () => {
    assert.ok((typeof fastify.db.getAll) !== 'undefined')
  })

  test('getAll function should return a collection', async () => {
    assert.ok(Array.isArray(fastify.db.getAll()))
    assert.ok(fastify.db.getAll().length === 1)
  })

  test('should have a getOne function', async () => {
    assert.ok((typeof fastify.db.getOne) !== 'undefined')
  })

  test('getOne function should query result based on given resumeId', async () => {
    const resumeId = (fastify.db.getAll())[0].resumeId;
    assert.ok(fastify.db.getOne(resumeId).resumeId === resumeId)
  })
})