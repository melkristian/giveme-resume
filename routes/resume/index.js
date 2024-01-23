export default async function (fastify) {
  // The spread operator seems to be a just a workaround but at least schema is shared
  // @see https://github.com/fastify/fastify-swagger/issues/172
  const getAllOpts = {
    schema: {
      response: {
        '2xx': {
          type: 'array',
          items: {
            ...(fastify.getSchema('#resumeGetAll'))
          }
        }
      }
    }
  }

  async function getAll(request, reply) {
    reply.type('application/json')
    reply.send(fastify.db.getAll());
  }

  async function getOne(request, reply) {
    reply.type('application/json')
    const resume = fastify.db.getOne(request.params.resumeId)
    if(!resume) {
      reply.notFound('Resume ID does not exist.')
    } else {
      reply.send(resume)
    }
  }

  // return all resumes
  fastify.get('/', getAllOpts, getAll)

  // return a single resume via `userId`
  fastify.get('/:resumeId', getOne)
}
