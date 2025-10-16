import {FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest} from "fastify";
import {LoginBodySchema, LoginFailureSchema, LoginResponseSchema} from "../schema/auth";
import {WorkflowBodySchema, WorkflowBodyType, WorkflowResponseSchema, WorkflowsListSchema} from "../schema/workflow";
import {LOGIN_PATH} from "./user.route";
import {Type} from "@sinclair/typebox/build/esm";


export const WORKFLOWS_PATH = '/workflows';
export const GET_WORKFLOW_PATH = '/workflow/:id';
export const EDIT_WORKFLOW_PATH = '/editworkflow';

export const SAVE_WORKFLOW_PATH = '/saveworkflow';

export const workflowRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {

    const protectedRoute = { preHandler: [authenticate] };
    const errorResponses = { 401: WorkflowResponseSchema, 404: WorkflowResponseSchema, 500: WorkflowResponseSchema };

    // Endpoint to retrieve all workflows of the user
    app.get(WORKFLOWS_PATH, {
        ...protectedRoute,
        schema:{
            response: {
                200: WorkflowsListSchema,
                ...errorResponses
            }
        }}, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.user;
            // Get the list of workflows and return it
            const workflows = await getAllWorkflowsByUser(userId);
            return {
                workflows: workflows,
                totalCount: workflows.length,
            };
        } catch (error) {
            app.log.error('Get all workflows - failed:', error);
            return reply.code(500).send({message: 'Workflows retrieval failed'});
        }
    });


    // Endpoint to retrieve the workflow corresponding to a specific ID
    app.get(GET_WORKFLOW_PATH, {
        ...protectedRoute,
        schema:{
            response: {
                200: WorkflowBodySchema,
                ...errorResponses
            }
        }}, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.user;
            const { id } = request.params as { id: string };
            const workflow = await getWorkflow(userId, id);

            return {
                workflowId: id,
                graph: workflow
            };
        } catch (error) {
            app.log.error(`Workflow ${id} retrieval - failed:`, error);
            return reply.code(500).send({message: 'Workflow retrieval failed'});
        }
    });


    // Endpoint to save a workflow
    app.post<{ Body: WorkflowBodyType }>(SAVE_WORKFLOW_PATH, {
        ...protectedRoute,
        schema: {
            body: WorkflowBodySchema,
            response: { 200: WorkflowResponseSchema, ...errorResponses },
        }
    }, async(request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.user;
            const { workflowId, workflow } = request.body;

            const result = await saveWorkflow(userId, workflowId, workflow);
            console.log(`Successfully saved workflow ${workflowId}, result: ${result}`)
            return {
                message: 'Successfully saved workflow'
            };
        } catch (error) {
            app.log.error(`Workflow ${id} save - failed:`, error);
            return reply.code(500).send({message: 'Workflow save failed'});
        }
    });

    app.delete('/logout', () => {});

    app.log.info('User routes registered');
}