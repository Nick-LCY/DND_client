<script lang="ts" setup>
import { ref } from 'vue';
import races_data from "../api/races.json";
import half_orc_data from "../api/_dnd5e:races.half_orc.json";
import markdownit from 'markdown-it';
const races = ref(races_data)
// const half_orc = ref(half_orc_data)

interface Category {
    name: string
    description: string
}
interface Categories {
    [key: string]: { data: Array<Category>, collapse: boolean }
}
const categories = ref<Categories>({});
for (let feature of half_orc_data.features) {
    if (feature.category in categories.value) {
        categories.value[feature.category].data.push({ name: feature.name, description: feature.description })
    } else {
        categories.value[feature.category] = { data: [{ name: feature.name, description: feature.description }], collapse: false }
    }
}

const categoryMapping: { [key: string]: string } = {
    race_traits: "种族特质"
}

function collapse(categoryName: string) {
    categories.value[categoryName].collapse = !categories.value[categoryName].collapse
}

const md = markdownit()
let result = md.render(half_orc_data.description)
</script>
<template>
    <main>
        <div class="bg-slate-600 flex flex-col justify-start items-stretch h-screen">
            <div class="flex mx-8 mt-4 justify-between items-center relative">
                <div class="step-circle finished"></div>
                <div class="step-circle"></div>
                <div class="step-circle"></div>
                <div class="step-circle"></div>
                <div class="absolute top-2 bottom-2 left-0 w-full bg-slate-50"></div>
            </div>
            <h2 class="font-bold text-center text-3xl my-8 flex-shrink-0">选择种族</h2>
            <div
                class="h-48 overflow-y-auto bg-slate-700 mx-8 rounded-lg scroll-xs flex flex-col items-stretch flex-shrink-0">
                <label class="option" v-for="race in races" :for="race.id" :key="race.id">
                    <input type="radio" class="hidden" name="race" :id="race.id">
                    <div class="option-circle"></div>
                    {{ race.name }}
                </label>
            </div>
            <div class="description scroll-xs" v-html="result"></div>
            <div class="mx-8 flex items-stretch h-10 shrink-0 gap-2 mb-8">
                <button class="leading-10 w-10 rounded-md bg-red-500 transition hover:bg-red-700">X</button>
                <button class="leading-10 flex-grow rounded-md bg-green-600 font-bold text-lg transition hover:bg-green-800">继续</button>
            </div>
        </div>
        <div class="bg-slate-800 h-screen">
            <h2 class="text-3xl mx-4 py-4 my-4 font-bold text-center border-b border-b-slate-50">特质</h2>
            <div class="scroll-xs overflow-y-auto m-4">
                <div v-for="(features, categoryName) in categories" :key="categoryName">
                    <button
                        class="cursor-pointer hover:bg-slate-700 w-full text-left transition rounded-md p-2 mb-2 flex justify-between"
                        @click="collapse(String(categoryName))">
                        <h3 class="text-2xl font-bold"> {{ categoryMapping[categoryName] }} </h3>
                    </button>
                    <div :class="{ collapsed: features.collapse }" class="transition origin-top">
                        <div v-for="feature, idx in features.data" :key="idx" class="ml-4 mb-2">
                            <h3 class="font-bold text-lg">{{ feature.name }}</h3>
                            <p>{{ feature.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<style scoped>
main {
    display: grid;
    grid-template-columns: 500px 1fr;
    height: 100vh;
    @apply text-slate-50;
}

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

input[name="race"]:checked+.option-circle::after {
    content: " ";
    @apply w-3 h-3 rounded-full bg-slate-300 absolute top-1 left-1;
}

.description {
    @apply m-8 p-2 bg-slate-800 overflow-auto rounded-lg flex-grow;
}

.collapsed {
    @apply scale-y-0;
}

.step-circle {
    @apply w-5 h-5 rounded-full border-2 border-slate-50 relative bg-slate-700 z-10;
}

.step-circle.finished {
    @apply bg-slate-50;
}
</style>