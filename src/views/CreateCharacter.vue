<script lang="ts" setup>
import { ref, computed } from 'vue';
import Step1 from '../components/createCharacter/step1.vue';

interface Category {
    name: string
    description: string
}
interface Categories {
    [key: string]: { data: Array<Category>, collapse: boolean }
}

const categories = ref<Categories>({});
const categoryMapping: { [key: string]: string } = {
    race_traits: "种族特质"
}
const currentStep = ref<number>(0);
const stepCardTranslate = computed(() => {
    return `translate(${currentStep.value * -100}%, 0)`
})


function collapse(categoryName: string) {
    categories.value[categoryName].collapse = !categories.value[categoryName].collapse
}

function updateRace(categories_data: Categories) {
    categories.value = categories_data
}
</script>
<template>
    <main>
        <div class="bg-slate-600 flex flex-col justify-start items-stretch h-screen">
            <div class="flex mx-8 mt-4 justify-between items-center relative">
                <button class="step-circle" @click="currentStep = 1" :class="{finished: currentStep >= 1}"></button>
                <button class="step-circle" @click="currentStep = 2" :class="{finished: currentStep >= 2}"></button>
                <button class="step-circle" @click="currentStep = 3" :class="{finished: currentStep >= 3}"></button>
                <button class="step-circle" @click="currentStep = 4" :class="{finished: currentStep >= 4}"></button>
                <div class="absolute top-2 bottom-2 left-0 w-full bg-slate-50"></div>
            </div>
            <div class="flex-grow flex justify-start overflow-x-hidden items-stretch">
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <!-- <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1> -->
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

.collapsed {
    @apply scale-y-0;
}

.step-circle {
    @apply w-5 h-5 rounded-full border-2 border-slate-50 relative bg-slate-700 z-10;
}

.step-circle.finished {
    @apply bg-slate-50;
}

.step-card {
    @apply flex flex-col items-stretch flex-shrink-0 w-full transition-transform;
}
</style>