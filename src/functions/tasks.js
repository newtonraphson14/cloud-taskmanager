const { app } = require('@azure/functions');

// Temporary in-memory storage (nanti ganti ke database)
let tasks = [];
let nextId = 1;

app.http('tasks', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('📝 Tasks API called:', request.method);

        try {
            // GET - Get all tasks
            if (request.method === 'GET') {
                return {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: true,
                        data: tasks,
                        count: tasks.length
                    })
                };
            }

            // POST - Create new task
            if (request.method === 'POST') {
                const body = await request.json();
                const { title, description, priority = 'medium' } = body;

                if (!title) {
                    return {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            success: false,
                            error: 'Title is required'
                        })
                    };
                }

                const newTask = {
                    id: nextId++,
                    title,
                    description,
                    priority,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                tasks.push(newTask);

                return {
                    status: 201,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: true,
                        message: 'Task created successfully',
                        data: newTask
                    })
                };
            }

            // Method not supported
            return {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: 'Method not allowed'
                })
            };

        } catch (error) {
            context.log('❌ Error:', error);
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: 'Internal server error'
                })
            };
        }
    }
});