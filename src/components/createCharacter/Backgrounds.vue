<script setup lang="ts">
import { ref } from 'vue';
import { getById } from '../../api/getById';
import { processFeatures } from '../../assets/js/featureProcessing';
import { renderMD } from '../../assets/js/renderMarkdown';
import backgrounds_data from "../../api/backgrounds.json";

const backgrounds = ref(backgrounds_data)
const emit = defineEmits(["change"])
const description = ref<string>("")
const backgroundSelection = ref<string>("")

async function changeBackground() {
    let backgroundData = await getById(backgroundSelection.value);
    let categories = processFeatures(backgroundData.features)
    description.value = renderMD(backgroundData.description)
    emit("change", categories)
}
</script>
<template>
    <div>
        <h2 class="font-bold text-center text-3xl mt-8 mb-4 flex-shrink-0">选择背景</h2>
        <div class="h-48 mx-8 scroll-xs flex items-stretch flex-shrink-0">
            <div class="w-1/2 overflow-y-auto bg-slate-700 rounded-lg scroll-xs flex flex-col items-stretch flex-grow">
                <label class="option" v-for="background in backgrounds" :for="background.id" :key="background.id">
                    <input type="radio" class="hidden" name="background" :id="background.id" :value="background.id"
                        v-model="backgroundSelection" @change="changeBackground">
                    <div class="option-circle"></div>
                    {{ background.name }}
                </label>
            </div>
        </div>
        <div class="description scroll-xs" v-html="description"></div>
    </div>
</template>
<style scoped>
.option {
    @apply p-4 text-lg bg-slate-700 flex items-center transition-colors cursor-pointer border-b-4 border-slate-800;
    @apply hover:bg-slate-800;
}

.option-circle {
    @apply w-6 h-6 mr-4 rounded-full bg-slate-800 border-2 border-slate-700 relative;
}

.option:hover>.option-circle {
    @apply border-slate-500
}

input[type="radio"]:checked+.option-circle::after {
    content: " ";
    @apply w-3 h-3 rounded-full bg-slate-300 absolute top-1 left-1;
}

.description {
    @apply m-8 p-2 bg-slate-800 overflow-auto rounded-lg h-64 flex-grow;
}
</style>