import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {Connection} from "@vue-flow/core";
import {NODE_SCHEMA_MAP} from "@/components/NodeSchemas.ts";


const initialNodes = [
    // { id: '1', type: 'input', label: 'S', position: { x: 50, y: 50 } },
    // { id: '2', type: 'input', label: 'P', position: { x: 60, y: 60 } }
];

const initialEdges = [
    // {id: 'e1-2', source: '1', target: '2'}
];

export const useWorkflowStore = defineStore('workflow', () => {
    // State variables
    const nodes = ref(initialNodes); // Nodes of graph
    const edges = ref(initialEdges); // Directed edges of graph
    const selectedNodeId = ref<string | null>(null); // Currently selected node
    const isGraphDirty = ref(false); // Unsaved changes in graph?

    // State changing actions

    function loadFromBackend() {
        // TODO: Implement protected POST request to get data
    }

    function getFullState() {
        return {
            nodes: nodes.value,
            edges: edges.value,
            lastSaved: new Date().toISOString()
        };
    }

    function setGraphClean() {
        isGraphDirty.value = false;
    }


    const selectedNode = computed(() => {
        return nodes.value.find(n => n.id == selectedNodeId.value) || null;
    })

    const isNodeSelected = computed(() => (nodeId: string) => {
        return selectedNodeId.value == nodeId;
    })

    function setSelectedNode(id: string | null) {
        selectedNodeId.value = id;
    }

    function clearSelectedNode() {
        selectedNodeId.value = null;
    }

    function newNode(id: string, type: string, x: number, y: number) {
        if ((!type) || (!x) || (!y)) {
            throw new Error('Required values (Type, x, y) must all be present. Found: ', type, x, y);
        }
        if (!id) {
            id = type + '_' + Date.now();
        }
        const schema = NODE_SCHEMA_MAP[type];
        if (schema) {
            // Parse the schema to get the simple key:value pairs, store in initialData
            const initialData: Record<string, any> = {};
            const properties = schema.properties;
            for (const key in properties) {
                const propDefinition = properties[key]

                if (propDefinition && 'default' in propDefinition) {
                    initialData[key] = propDefinition.default;
                } else if (propDefinition && propDefinition.type == 'object') {
                    initialData[key] = {};
                } else {
                    initialData[key] = null;
                }
            }
            // Use the initialData derived from the schema of the node type, to create the new node
            const nodeData = JSON.parse(JSON.stringify(initialData));
            const node = {
                id,
                type,
                position: { x, y },
                data: nodeData,
            };
            // Push the newly created node to the graph state
            nodes.value.push(node);
            isGraphDirty.value = true;
            return node;
        } else {
            throw Error('Schema not found for type ' + type)
        }
    }

    function addConnection(connection: Connection) {
        const newEdge = {
            id: 'e_' + connection.source + '_' + connection.target + '_' + Date.now(),
            source: connection.source,
            target: connection.target,
            markerEnd: 'arrowclosed',
            type: 'default' // Might allow more types later
        };

        edges.value.push(newEdge);
        isGraphDirty.value=true;
        return newEdge
    }

    return {
        nodes,
        edges,
        selectedNodeId,
        isGraphDirty,
        selectedNode,
        isNodeSelected,
        setSelectedNode,
        clearSelectedNode,
        newNode,
        addConnection,
        loadFromBackend,
        setGraphClean,
        getFullState
    };
});