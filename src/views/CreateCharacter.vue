<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue';
import Races from '../components/createCharacter/Races.vue';
import Classes from '../components/createCharacter/Classes.vue';
import { Categories } from '../assets/js/categories';


const categories = ref<{ [key: number]: Categories }>({});
const currentCategories = computed(
    () => currentStep.value in categories.value ? categories.value[currentStep.value] : {}
)
const categoryMapping: { [key: string]: string } = {
    race_traits: "种族特质",
    class_traits: "职业特质",
    proficiencies: "熟练项",
}
const currentStep = ref<number>(0);
const totalSteps = ref<number>(5);
const stepCardTranslate = computed(() => {
    return `translate(${currentStep.value * -100}%, 0)`
})
const featureSelections = ref<{ [key: string]: Array<string> }>({});
const categoryRefs = ref<Array<HTMLElement>>([]);

function recordCategoryHeight() {
    for (let featureRef of categoryRefs.value) {
        featureRef.style.setProperty("height", `${featureRef.offsetHeight}px`)
    }
}

function collapse(categoryName: string) {
    categories.value[currentStep.value][categoryName].collapse
        = !categories.value[currentStep.value][categoryName].collapse
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
    categories.value[currentStep.value] = categories_data
    nextTick(() => recordCategoryHeight())
}

function shouldCheckboxDisabled(checkboxValue: string, featureId: string, choose: number): boolean {
    if (featureSelections.value[featureId].length < choose) return false
    if (featureSelections.value[featureId].includes(checkboxValue)) return false
    return true
}

function prevStep() {
    currentStep.value = Math.max(0, currentStep.value - 1)
    for (let categoryName in categories.value[currentStep.value]) {
        let category = categories.value[currentStep.value][categoryName]
        category.collapse = false
    }
    nextTick(() => recordCategoryHeight())
}

function setStep(step: number) {
    currentStep.value = step
    for (let categoryName in categories.value[currentStep.value]) {
        let category = categories.value[currentStep.value][categoryName]
        category.collapse = false
    }
    nextTick(() => recordCategoryHeight())
}

function nextStep() {
    currentStep.value++
    for (let categoryName in categories.value[currentStep.value]) {
        let category = categories.value[currentStep.value][categoryName]
        category.collapse = false
    }
    nextTick(() => recordCategoryHeight())
}
</script>
<template>
    <main>
        <div class="bg-slate-600 flex flex-col justify-start items-stretch h-screen">
            <div class="flex mx-8 mt-4 justify-between items-center relative">
                <button v-for="i in totalSteps" :key="i" @click="setStep(i)" class="step-circle"
                    :class="{ finished: currentStep >= i, 'cursor-default': currentStep == i }"
                    :disabled="currentStep == i"></button>
                <div class="absolute top-2 bottom-2 left-0 w-full bg-slate-50"></div>
            </div>
            <div class="flex-grow flex justify-start overflow-x-hidden items-stretch">
                <div class="step-card"></div>
                <Races class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateCategories"></Races>
                <Classes class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateCategories">
                </Classes>
                <!-- <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1> -->
            </div>
            <div class="mx-8 flex items-stretch h-10 shrink-0 gap-2 mb-8">
                <button @click="prevStep"
                    class="leading-10 w-10 rounded-md bg-gray-400 transition hover:bg-gray-700">👈</button>
                <button @click="nextStep"
                    class="leading-10 flex-grow rounded-md bg-green-600 font-bold text-lg transition hover:bg-green-800">继续</button>
            </div>
        </div>
        <div class="bg-slate-800 h-screen flex flex-col items-stretch">
            <h2 class="text-3xl mx-4 py-4 my-4 font-bold text-center border-b border-b-slate-50 flex-shrink-0">特质</h2>
            <div class="scroll-xs overflow-y-scroll m-4 h-64 flex-grow pr-4">
                <div v-for="(features, categoryName) in currentCategories" :key="categoryName"
                    class=" border-2 border-gray-700 rounded-md mb-2">
                    <button
                        class="cursor-pointer hover:bg-slate-700 w-full text-left transition p-2 flex justify-between items-center"
                        :class="{ 'bg-slate-700': !features.collapse }" @click="collapse(String(categoryName))">
                        <h3 class="text-2xl font-bold"> {{ categoryMapping[categoryName] }} </h3>
                        <div class="relative w-4 h-1 transition" :class="{ 'rotate-45': !features.collapse }">
                            <div class="w-4 h-1 bg-slate-50"></div>
                            <div class="w-4 h-1 bg-slate-50 absolute top-0 transition rotate-90"></div>
                        </div>
                    </button>
                    <div class="collapse-container scroll-xs" :id="String(categoryName)" ref="categoryRefs"
                        :class="{ collapsed: features.collapse }">
                        <div v-for="feature, idx in features.data" :key="idx" class="ml-4 my-2">
                            <h3 class="font-bold text-lg">{{ feature.name }}</h3>
                            <p class="description" v-html="feature.description"></p>
                            <div v-if="'selection' in feature" class="ml-4">
                                <label v-for="option of feature.selection!.available" :key="option.id" :for="option.id"
                                    class="cursor-pointer"
                                    :class="{ 'checkbox-disabled': shouldCheckboxDisabled(option.id, feature.id, feature.selection!.choose) }">
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
    height: 0 !important;
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

.collapse-container {
    @apply overflow-hidden transition-all;
}

.checkbox-disabled {
    @apply cursor-not-allowed text-gray-400;
}
</style>