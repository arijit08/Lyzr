<script setup lang="ts">


import {computed} from "vue";
import {PROCESSING_NODE_STYLE} from "@/config";
import BaseNode from "@/components/node types/BaseNode.vue";
import type {AgentAPINode} from "@/components/NodeSchemas.ts";

const props = defineProps<{
  id: string,
  data: AgentAPINode
}>();

const baseProps = computed(() => ({
  id: props.id,
  label1: props.data.label,
  styleClass: PROCESSING_NODE_STYLE,
  hasTarget: true,
  hasSource: true
}));

</script>

<template>
  <BaseNode v-bind="baseProps">
    <!--    <div class="text-sm font-bold text-gray-500">{{ props.data.label }}</div>-->
  </BaseNode>
</template>

<style scoped>

</style>