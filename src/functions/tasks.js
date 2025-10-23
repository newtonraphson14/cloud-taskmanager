const { app } = require('@azure/functions');
const sql = require('mssql');

// SQL Database configuration - pakai environment variables
const dbConfig = {
    server: process.env.SQL_SERVER || 'ikbar-tasks-server.database.windows.net',
    database: process.env.SQL_DATABASE || 'taskdb',
    user: process.env.SQL_USER || 'ikbaradmin',
    password: process.env.SQL_PASSWORD || 'Password123!',
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

app.http('tasks', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('📝 Tasks API called:', request.method);
        context.log('🔧 Database Config:', {
            server: dbConfig.server,
            database: dbConfig.database,
            user: dbConfig.user
        });

        try {
            // Connect to database
            await sql.connect(dbConfig);
            
            // GET - Get all tasks
            if (request.method === 'GET') {
                const result = await sql.query`SELECT * FROM Tasks ORDER BY id DESC`;
                
                // DEBUG LOGGING
                context.log('📊 Total tasks in database:', result.recordset.length);
                context.log('📋 Tasks data:', result.recordset);
                
                return {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: true,
                        data: result.recordset,
                        count: result.recordset.length
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

                const result = await sql.query`
                    INSERT INTO Tasks (title, description, priority, status, createdAt) 
                    OUTPUT INSERTED.*
                    VALUES (${title}, ${description}, ${priority}, 'pending', GETDATE())
                `;

                return {
                    status: 201,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: true,
                        message: 'Task created successfully',
                        data: result.recordset[0]
                    })
                };
            }

            return {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: 'Method not supported yet'
                })
            };

        } catch (error) {
            context.log('❌ Database error:', error);
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: 'Database error',
                    details: error.message
                })
            };
        } finally {
            await sql.close();
        }
    }
}); 