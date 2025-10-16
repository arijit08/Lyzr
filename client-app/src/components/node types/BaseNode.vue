<script setup lang="ts">


import {useWorkflowStore} from "@/stores/WorkflowStore.ts";
import {computed} from "vue";
import {Handle, Position} from "@vue-flow/core";

const props = defineProps<{
  id: string,
  label1: string,
  styleClass: string,
  hasSource: boolean,
  hasTarget: boolean,
}>();
// TODO: REPLACE label1 WITH LABEL LATER

console.log('BASENODE -->', props);

const store = useWorkflowStore();
const isSelected = computed(() => store.isNodeSelected(props.id));

</script>

<template>
  <div :class="[{
    'ring-4 ring-yellow-400 border-yellow-600': isSelected,
    'border-gray-500': !isSelected,
    },
    props.styleClass // tailwindcss style class passed in by the parent
    ]"
       :style="{
    'width': '100px',
    'height': '100px'
       }"
       class="p-3 flex items-center border-2 dark:border-gray-500 rounded-lg bg-white shadow-lg text-sm justify-center hover:dark:bg-gray-300">
    <slot>
      <div class="text-sm font-bold text-gray-500">{{ props.label1.toUpperCase() }}</div>
    </slot>
  </div>
    <Handle v-if="hasTarget"
            type="target"
            marker-end="arrowclosed"
            :position="Position.Left"
            id="in" />
    <Handle v-if="hasSource"
            type="source"
            marker-end="arrowclosed"
            :position="Position.Right"
            id="out" />

</template>

<style scoped>

</style>