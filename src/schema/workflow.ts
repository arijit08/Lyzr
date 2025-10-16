import {Static, Type} from '@sinclair/typebox';

export const WorkflowBodySchema = Type.Object({
    workflowId: Type.String(),
    graph: Type.Object({
        nodes: Type.Array(Type.Any()),
        edges: Type.Array(Type.Any()),
        lastSaved: Type.String(),
    }),
})

export type WorkflowBodyType = Static<typeof WorkflowBodySchema>;

export const WorkflowResponseSchema = Type.Object({
    message: Type.String(),
    statusCode: Type.Optional(Type.Number())
});

export const WorkflowsListSchema = Type.Object({
    workflows: Type.Array(WorkflowBodySchema),
    totalCount: Type.Number(),
});

export const ErrorSchema = Type.Object({
    workflows: Type.Array(WorkflowBodySchema),
    totalCount: Type.Number(),
});