import Fastify, {FastifyReply, FastifyRequest, FastifyInstance, preHandlerHookHandler} from "fastify";
import cors from '@fastify/cors';
import jwt from '@fastify/jwt'
import {WorkflowBodySchema} from "./schema/workflow";
import {LoginBodySchema, LoginBodyType, LoginFailureSchema, LoginResponseSchema} from "./schema/auth";
import {dbClient} from "./db/db-client";
import {LOGIN_PATH, userRoutes} from "./routes/user.route";
import {AUTH_CONFIG} from "./config/constants";


const SERVICE_ID = 'orchestration-lyzr';  // An identifier for this pilot
const CORS_ORIGIN = '*';  // For this pilot
const PORT = 3000;
const HOST = '0.0.0.0';

// Initialize fastify with logging
const server: FastifyInstance = Fastify({logger: true});
// Register CORS for frontend (Vue)
server.register(cors, {
    origin: CORS_ORIGIN
});


// Register jwt
server.register(jwt, {
    secret: AUTH_CONFIG.JWT_SECRET
});


// Register routes
server.register(userRoutes, { prefix: 'api/users' })


// Authentication handler
const authenticate: preHandlerHookHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.code(401).send( { message: 'Authentication failed'} );
    }
}


// API Endpoints:


// Health check/API test
server.get('/health', async (request, reply) => {
    return { status: 'ok', service: SERVICE_ID}
});


// Login route
server.post<{ Body: LoginBodyType }>(LOGIN_PATH, {
    schema: {
        body: LoginBodySchema,
        response: { 200: LoginResponseSchema, 401: LoginFailureSchema },
    },
},
    async (request, reply) => {
    const {username, password} = request.body;
    // Verify the user
    const user = await dbClient.findUser(username);
    if (!user) {
        return { message: 'Invalid username or password' };
    }
    // Verify the password
    const passwordValid = await dbClient.verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
        return { message: 'Invalid username or password' };
    }
    // Issue token to user since authentication is successful
    const userId = user.id;
    // TODO: User roles/permissions must be incorporated instead of the following line
    const role = user.role;
    const token = server.jwt.sign({ userId, role });

    return {token};
    });


// Start the server at load
const start = async () => {
    try {
        await server.listen({ port: PORT, host: HOST});
        server.log.info(`Server listening on ${server.server.address()}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

console.log(start());
