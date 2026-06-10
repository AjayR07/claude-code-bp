/**
 * OpenAPI / Swagger specification for the Tasks API.
 *
 * Consumed by swagger-ui-express and mounted at GET /
 * so participants can explore the API immediately on first run.
 */
export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Tasks API — Claude Code Workshop',
    version: '2.0.0',
    description:
      'A small Express REST API for managing tasks and projects. ' +
      'Built as the hands-on base for the Presidio "Mastering Claude Code" workshop.',
    contact: {
      name: 'Presidio Engineering',
      url: 'https://www.presidio.com',
    },
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local dev server' },
  ],
  tags: [
    { name: 'Health', description: 'Server health check' },
    { name: 'Tasks', description: 'Task management endpoints' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        operationId: 'getHealth',
        responses: {
          200: {
            description: 'Server is up',
            content: {
              'application/json': {
                example: { status: 'ok', uptime: 42.1, env: 'development' },
              },
            },
          },
        },
      },
    },

    '/api/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List tasks',
        description:
          'Returns a paginated, filtered, sorted list of tasks. ' +
          'In-progress tasks appear first, then todo, then done.',
        operationId: 'listTasks',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['todo', 'in_progress', 'done'] } },
          { name: 'priority', in: 'query', schema: { type: 'string', enum: ['low', 'medium', 'high'] } },
          { name: 'assignee', in: 'query', schema: { type: 'string' } },
          { name: 'tag', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1, minimum: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 } },
        ],
        responses: {
          200: {
            description: 'Paginated task list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a task',
        operationId: 'createTask',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskInput' },
              example: {
                title: 'Try Claude Code',
                description: 'Hands-on workshop exercise',
                status: 'in_progress',
                priority: 'high',
                tags: ['claude', 'workshop'],
                assignee: 'ajay',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Task' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },

    '/api/tasks/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      get: {
        tags: ['Tasks'],
        summary: 'Get a task by ID',
        operationId: 'getTask',
        responses: {
          200: {
            description: 'Task found',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Task' } } },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Tasks'],
        summary: 'Update a task (partial)',
        operationId: 'updateTask',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskInput' },
              example: { status: 'done', priority: 'low' },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Task' } } },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete a task',
        operationId: 'deleteTask',
        responses: {
          204: { description: 'Deleted — no content' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },

  components: {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', readOnly: true },
          title: { type: 'string', example: 'Write the docs' },
          description: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['todo', 'in_progress', 'done'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          tags: { type: 'array', items: { type: 'string' }, example: ['claude', 'workshop'] },
          dueDate: { type: 'string', format: 'date-time', nullable: true },
          assignee: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time', readOnly: true },
          updatedAt: { type: 'string', format: 'date-time', readOnly: true },
        },
      },
      TaskInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          status: { type: 'string', enum: ['todo', 'in_progress', 'done'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          tags: { type: 'array', items: { type: 'string' } },
          dueDate: { type: 'string', format: 'date-time', nullable: true },
          assignee: { type: 'string', nullable: true },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 42 },
          pages: { type: 'integer', example: 3 },
        },
      },
    },
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { type: 'object', properties: { error: { type: 'string' } } },
            example: { error: "Task 'abc-123' not found" },
          },
        },
      },
      ValidationError: {
        description: 'Validation failed',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' },
                errors: { type: 'array', items: { type: 'string' } },
              },
            },
            example: { error: 'Validation failed', errors: ['title is required'] },
          },
        },
      },
    },
  },
};
