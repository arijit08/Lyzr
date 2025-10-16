<script setup lang="ts">
import {useRouter} from "vue-router";
import {Connection, useVueFlow, VueFlow} from "@vue-flow/core";
import { Background } from '@vue-flow/background';
import {onMounted, ref} from "vue";
import {useWorkflowStore} from "../stores/WorkflowStore.ts";
import {componentDimensions, components as NodeTypes} from "@/components/node types/index.ts";
import {EDIT_WORKFLOW_PATH, LOGIN_PATH, SAVE_WORKFLOW_PATH, SERVER_ADDRESS} from "@/config";
import * as events from "events";
import {storeToRefs} from "pinia";

const router = useRouter();
const componentNames = Object.keys(NodeTypes);

// Layout states
const isComponentsOpen = ref(true);
const isPropertiesOpen = ref(true);
const { project, addNodes, screenToFlowCoordinate, setNodes } = useVueFlow();
const draggedComponent = ref('');
const saveStatusMsg = ref('');

// Flow state
const store = useWorkflowStore();
const { nodes, edges } = storeToRefs(store);
const workflowId = ref('');


// Get the workflow ID param if it exists
onMounted(() => {
  if (!router.params) {
    return;
  }

  const workflowId = router.params.id;

  if (workflowId) {
    // ID has been passed, load the workflow if it exists
    if (loadGraph(workflowId)) {
      // Workflow has been successfully loaded
      console.log('Loaded ' + workflowId);
    } else {
      // No such workflow exists/ Load failed
      store.initializeNewGraph();
    }
  } else {
    store.initializeNewGraph();
  }
})


// Logout
function handleLogout() {
  localStorage.removeItem('auth_token');
  router.push(LOGIN_PATH);
}


// Save the existing graph state
async function saveWorkflow() {
  saveStatusMsg.value = 'Saving, please wait...';

  // POST request to login function
  try {
    const response = await fetch(SERVER_ADDRESS + SAVE_WORKFLOW_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Login successful. Save the token
      localStorage.setItem('auth_token', data.token);
      logInStatusMsg.value = 'Login successful. Redirecting...';

      // Redirect to the Create/Edit Workflow page
      router.push(EDIT_WORKFLOW_PATH);
    } else {
      // Server returned failure message
      logInStatusMsg.value = `Login failed: ${data.message}`;
    }
  } catch (error) {
    // Server returned neither of the expected responses
    logInStatusMsg.value = 'Network Error';
    console.error('Login failed:', error);
  }
}


// Allow dragging (from the component pane) onto the workflow view
const onDragStart = (event: DragEvent, type: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', type);
    event.dataTransfer.effectAllowed = 'move';
    draggedComponent.value = type;
  }
};


// Drag and drop
const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}


// When a component is dropped onto the workflow view, create a new node for it
const onDrop = (event: DragEvent) => {
  if (!event.dataTransfer) {
    return;
  }
  // Get the node type i.e. component type
  const type = event.dataTransfer.getData('application/vueflow');
  if (!type) {
    return;
  }
  // Convert to flow coordinates
  const flowPosition = screenToFlowCoordinate({
    x: event.clientX,
    y: event.clientY
  });
  // Adjust position such that the centre of the node falls where the cursor is
  const adjustedClientX = flowPosition.x - componentDimensions[type]['width']/2;
  const adjustedClientY = flowPosition.y - componentDimensions[type]['height']/2;
  // Create a new node in the workflow store (bound to the workflow view)
  const node = store.newNode( '', type, adjustedClientX, adjustedClientY);

}


// When a node is clicked, select it
const onNodeClick = ({ node }: { node: { id: string} }) => {
  store.setSelectedNode(node.id);
};


// When a node is dragged, select it
const onNodeDrag = ({ node }: { node: { id: string} }) => {
  store.setSelectedNode(node.id);
};


// Upon connection between two nodes
const onConnect = (params: Connection) => {
  store.addConnection(params);
}


</script>

<template>
<div class="flex flex-col h-screen w-screen overflow-hidden">
  <!-- TOP PANEL -->
  <header class="flex items-center justify-between p-3 bg-gray-900 shadow-md flex-shrink-0">
    <div class="text-xl font-bold text-white">
      Lyzr Orchestration Builder
    </div>
    <div class="flex space-x-3">
      <button @click="saveWorkflow" class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition">Save Workflow</button>
      <button @click="handleLogout" class="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition">Logout</button>
    </div>
  </header>

  <div class="flex flex-grow overflow-hidden">
    <!-- COMPONENTS PANE -->
    <aside :class="{'w-60': isComponentsOpen, 'w-12': !isComponentsOpen}"
           class="bg-gray-800 text-white p-3 border-r border-gray-700 transition-all duration-300 overflow-y-auto flex-shrink-0">
      <div class="flex justify-between items-center mb-4">
        <h3 v-if="isComponentsOpen" class="text-lg font-semibold order-2">Components</h3>
        <button @click="isComponentsOpen = !isComponentsOpen" class="text-gray-400 hover:text-white order-1">
          <span v-if="isComponentsOpen">←</span>
          <span v-if="!isComponentsOpen">→</span>
        </button>
      </div>

      <div v-if="isComponentsOpen" class="space-y-2">
        <div v-for="name in componentNames"
             :key="name"
             class="bg-gray-700 p-2 rounded text-sm cursor-grab hover:bg-gray-600 transition"
             draggable="true"
             @dragstart="onDragStart($event, name)">
          {{ name.replace(/Node/g, '').replace(/([A-Z])/g, '$1').trim() }}
        </div>
      </div>
    </aside>

    <!-- MAIN GRAPH EDITOR -->
    <main class="flex-grow h-screen">
      <VueFlow
          :nodes="nodes"
          :edges="edges"
          :node-types="NodeTypes"
          @node-click="onNodeClick"
          @node-drag="onNodeDrag"
          @connect="onConnect"
          @dragover="onDragOver"
          @drop="onDrop"
          fit-view-on-init
          class="bg-gray-100 h-full w-full">
        <Background :size="2" :gap="20" pattern-color="#BDBDBD" />
      </VueFlow>
    </main>

    <!-- PROPERTIES PANE -->
    <aside :class="{'w-100': isPropertiesOpen, 'w-12': !isPropertiesOpen}" class="bg-gray-800 text-white p-3 border-l border-gray-700 transition-all duration-300 overflow-y-auto flex-shrink-0">
      <div class="flex justify-between items-center mb-4">
        <button @click="isPropertiesOpen = !isPropertiesOpen" class="text-gray-400 hover:text-white order-2">
          <span v-if="isPropertiesOpen">→</span>
          <span v-if="!isPropertiesOpen">←</span>
        </button>
        <h3 v-if="isPropertiesOpen" class="text-lg font-semibold order-1">Properties</h3>
      </div>

      <div v-if="isPropertiesOpen" class="space-y-2">
        <div v-if="!store.selectedNode">
          <p class="text-sm text-gray-400 p-2">Select a node to configure it</p>
        </div>
        <div v-else class="p-4 bg-gray-700 rounded-lg">
          <p class="text-sm">Type: <span class="font-mono text-yellow-400">{{store.selectedNode.type}}</span></p>
          <p class="text-sm">ID: {{store.selectedNode.id}}</p>
          <h4 class="font-semibold mb-2 mt-4 text-gray-300">Custom Properties:</h4>
          <div v-for="(value, key) in store.selectedNode.data" :key="key" class="mb-3">
            <label class="block text-xs font-medium mb-1 capitalize ">{{key}}</label>
            <input
                type="text"
                :value="value"
                @input="store.selectedNode.data[key] = $event.target.value"
                class="w-full p-2 text-sm bg-gray-600 border border-gray-500 rounded text-white focus:ring-blue-500"
                placeholder=" - " />
          </div>
        </div>
      </div>
    </aside>

  </div>
</div>
</template>

<style scoped>

</style>