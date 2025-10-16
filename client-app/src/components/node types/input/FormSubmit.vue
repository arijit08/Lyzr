<script setup lang="ts">


import {computed, toRef} from "vue";
import type {FormSubmitNode} from "@/components/NodeSchemas.ts";
import {INPUT_NODE_STYLE} from "@/config";
import BaseNode from "@/components/node types/BaseNode.vue";

const props = defineProps<{
  id: string,
  data: FormSubmitNode
}>();


const baseProps = computed(() => ({
  id: props.id,
  label1: props.data.label,
  styleClass: INPUT_NODE_STYLE,
  hasTarget: false,
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