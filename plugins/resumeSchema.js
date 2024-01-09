import fp from 'fastify-plugin'

export default fp(async function (fastify) {
  fastify.addSchema({
    "$id": "#resumeGetAll",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "resumeId": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "contact": {
        "type": "object",
        "additionalProperties": true
      },
      "photo": {
        "type": "string"
      }
    }
  })
})
