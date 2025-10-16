import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {LoginBodySchema, LoginFailureSchema, LoginResponseSchema} from "../schema/auth";
import {WorkflowBodySchema, WorkflowResponseSchema} from "../schema/workflow";


export const SERVER_ADDRESS = 'http://localhost:3000';
export const LOGIN_PATH = '/login';

export async function userRoutes (app: FastifyInstance) {
    app.get('/', (request: FastifyRequest, reply: FastifyReply) => {
        reply.send({ message: '/ route hit' })
    });

    app.post('/register', () => {});

    app.post(LOGIN_PATH, {
        schema: {
            body: LoginBodySchema,
            response: { 200: LoginResponseSchema, 401: LoginFailureSchema },
        }
    } , () => {});

    app.delete('/logout', () => {});

    app.log.info('User routes registered');
}