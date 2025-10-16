// Define the `data` field (payload) of every Node here

import {Type} from "@sinclair/typebox";

export const FormSubmitSchema = Type.Object({
    label: Type.String({ default: 'Form Submit' }),
    formDefinition: Type.Any({default: {}}),
    webhookPath: Type.String({ default: '' })
});

export type FormSubmitNode = Static<typeof FormSubmitSchema>

export const AgentAPISchema = Type.Object({
    label: Type.String({ default: 'Agent API' }),
    endPoint: Type.String({ default: '' }),
    prompt: Type.String({ default: '' }),
    timeoutMs: Type.Number( { default: 10000 }), // timeout time in miliseconds
});

export type AgentAPINode = Static<typeof AgentAPISchema>

// FOR ANY NEW NODE TO BE ADDED, ADD THE PAYLOAD SCHEMA ABOVE,
// PROVIDE MAPPING BETWEEN THE COMPONENT NAME AND SCHEMA BELOW
export const NODE_SCHEMA_MAP = {
    FormSubmit: FormSubmitSchema,
    AgentAPI: AgentAPISchema
}