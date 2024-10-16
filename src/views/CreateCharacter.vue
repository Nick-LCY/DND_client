<script lang="ts" setup>
import { ref, computed } from 'vue';
import Races from '../components/createCharacter/Races.vue';
import Classes from '../components/createCharacter/Classes.vue';

interface Option {
    id: string
    name: string
    description: string
}

interface Selection {
    choose: number
    available: Array<Option>
}
interface Feature {
    id: string
    name: string
    description: string
    selection?: Selection
}
interface Categories {
    [key: string]: { data: Array<Feature>, collapse: boolean }
}

const categories = ref<Categories>({});
const categoryMapping: { [key: string]: string } = {
    race_traits: "种族特质",
    class_traits: "职业特质",
    proficiencies: "熟练项",
}
const currentStep = ref<number>(0);
const stepCardTranslate = computed(() => {
    return `translate(${currentStep.value * -100}%, 0)`
})
const featureSelections = ref<{ [key: string]: Array<string> }>({});


function collapse(categoryName: string) {
    categories.value[categoryName].collapse = !categories.value[categoryName].collapse
}

function updateCategories(categories_data: Categories) {
    for (let key in categories_data) {
        let features = categories_data[key].data
        for (let feature of features) {
            if ("selection" in feature && !(feature.id in featureSelections.value)) {
                featureSelections.value[feature.id] = []
            }
        }
    }
    categories.value = categories_data
}

function shouldCheckboxDisabled(checkboxValue: string, featureId: string, choose: number): boolean {
    if (featureSelections.value[featureId].length < choose) return false
    if (featureSelections.value[featureId].includes(checkboxValue)) return false
    return true
}
</script>
<template>
    <main>
        <div class="bg-slate-600 flex flex-col justify-start items-stretch h-screen">
            <div class="flex mx-8 mt-4 justify-between items-center relative">
                <button class="step-circle" @click="currentStep = 1" :class="{ finished: currentStep >= 1 }"></button>
                <button class="step-circle" @click="currentStep = 2" :class="{ finished: currentStep >= 2 }"></button>
                <button class="step-circle" @click="currentStep = 3" :class="{ finished: currentStep >= 3 }"></button>
                <button class="step-circle" @click="currentStep = 4" :class="{ finished: currentStep >= 4 }"></button>
                <div class="absolute top-2 bottom-2 left-0 w-full bg-slate-50"></div>
            </div>
            <div class="flex-grow flex justify-start overflow-x-hidden items-stretch">
                <Races class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateCategories"></Races>
                <Classes class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateCategories">
                </Classes>
                <!-- <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1> -->
            </div>
        </div>
        <div class="bg-slate-800 h-screen flex flex-col items-stretch">
            <h2 class="text-3xl mx-4 py-4 my-4 font-bold text-center border-b border-b-slate-50 flex-shrink-0">特质</h2>
            <div class="scroll-xs overflow-y-auto m-4 h-64 flex-grow pr-4">
                <div v-for="(features, categoryName) in categories" :key="categoryName">
                    <button
                        class="cursor-pointer hover:bg-slate-700 w-full text-left transition rounded-md p-2 mb-2 flex justify-between"
                        @click="collapse(String(categoryName))">
                        <h3 class="text-2xl font-bold"> {{ categoryMapping[categoryName] }} </h3>
                    </button>
                    <div :class="{ collapsed: features.collapse }" class="overflow-hidden">
                        <div v-for="feature, idx in features.data" :key="idx" class="ml-4 mb-2">
                            <h3 class="font-bold text-lg">{{ feature.name }}</h3>
                            <p class="description" v-html="feature.description"></p>
                            <div v-if="'selection' in feature" class="ml-4">
                                <label v-for="option of feature.selection!.available" :key="option.id" :for="option.id"
                                    class="cursor-pointer"
                                    :class="{ 'cursor-not-allowed': shouldCheckboxDisabled(option.id, feature.id, feature.selection!.choose) }">
                                    <input type="checkbox" :id="option.id" :value="option.id" class="hidden"
                                        v-model="featureSelections[feature.id]"
                                        :disabled="shouldCheckboxDisabled(option.id, feature.id, feature.selection!.choose)">
                                    <div class="flex items-center">
                                        <div class="checkbox"></div>
                                        <div> {{ option.name }}</div>
                                    </div>
                                    <div class="description pl-6 text-slate-400" v-html="option.description"></div>
                                </label>
                            </div>
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
    @apply h-0;
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

.checkbox {
    @apply w-4 h-4 rounded-sm border border-slate-50 relative mr-2;
}

input[type="checkbox"]:checked+div>.checkbox::after {
    content: " ";
    @apply bg-slate-50 rounded-sm absolute;
    top: 2px;
    left: 2px;
    bottom: 2px;
    right: 2px;
}
</style>