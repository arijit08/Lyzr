import {markRaw} from "vue";
import {NODE_DEFAULT_HEIGHT, NODE_DEFAULT_WIDTH} from "@/config";

const modules = import.meta.glob('./*/*.vue', {eager: true}) as Record <string, { default: any }>

const components: Record<string, any> = {};
const componentDimensions: Record<string, any> = {};

for (const path in modules) {
    const componentModule = modules[path].default;
    // First group matches the category (input/output/processing), second group matches the component name
    const filename = path.replace(/^\.\/(.+)\/(.+)\.vue$/, '$2');
    const dimensions = componentModule.dimensions || {'width': NODE_DEFAULT_WIDTH, 'height': NODE_DEFAULT_HEIGHT};
    components[filename] = markRaw(componentModule);
    componentDimensions[filename] = markRaw(dimensions);
}

export { components, componentDimensions };