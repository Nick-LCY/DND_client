<script lang="ts" setup>
import { ref, computed } from 'vue';
import Start from '../components/createCharacter/Start.vue';
import Races from '../components/createCharacter/Races.vue';
import Classes from '../components/createCharacter/Classes.vue';
import Backgrounds from '../components/createCharacter/Backgrounds.vue';
import { Categories } from '../assets/js/categories';
import { Effect, EffectSelection as EffectSelectionType, isEffect } from '../assets/js/originalDataType';
import EffectSelection from '../components/createCharacter/EffectSelection.vue';
import _ from "lodash";



const categories = ref<{ [key: number]: Categories }>({});
const currentCategoryCollapse = computed(
    () => {
        if (!(currentStep.value in categoryCollapse.value)) categoryCollapse.value[currentStep.value] = {}
        return categoryCollapse.value[currentStep.value]
    }
)
const categoryMapping: { [key: string]: string } = {
    race_traits: "种族特质",
    race_proficiencies: "种族熟练项",
    class_traits: "职业特质",
    class_proficiencies: "职业熟练项",
    subclass_traits: "子职业特质",
    subclass_proficiencies: "子职业熟练项",
    subrace_traits: "亚种特质",
    subrace_proficiencies: "亚种熟练项",
    background_traits: "背景特质",
    background_proficiencies: "背景熟练项",
}
const currentStep = ref<number>(0);
const totalSteps = ref<number>(5);
const stepTranslate = computed(() => {
    return `translate(${currentStep.value * -100}%, 0)`
})
const featureSelections = ref<{ [key: string]: any }>({});
const categoryRefs = ref<Array<HTMLElement>>([]);
const categoryCollapse = ref<{ [step: number]: { [category: string]: boolean } }>({})

function collapse(categoryName: string) {
    let currentCollapse = currentCategoryCollapse.value[categoryName]
    let targetElement: HTMLElement
    for (let featureRef of categoryRefs.value) {
        if (featureRef.id == categoryName) {
            targetElement = featureRef
            break
        }
    }
    if (!currentCollapse) {
        targetElement!.style.setProperty("height", `${targetElement!.offsetHeight}px`)
    } else {
        setTimeout(() => {
            targetElement!.style.setProperty("height", "")
        }, 151)
    }
    setTimeout(() => {
        currentCategoryCollapse.value[categoryName] = !currentCollapse
    }, 1)
}

interface vModelSelection extends Array<string | vModelSelection> {
    [index: number]: string | vModelSelection
}

function visitEffects(effects: (EffectSelectionType | Effect)[] | EffectSelectionType, vModelObj: vModelSelection, inSelection: boolean = false) {
    if (effects instanceof Array) {
        for (let effect of effects) {
            if (isEffect(effect)) {
                if (!inSelection) vModelObj.push(effect.id)
            } else {
                const sublist: vModelSelection = []
                vModelObj.push(sublist)
                visitEffects(effect.available, sublist, true)
            }
        }
    } else {
        effects.available.sort((a, b) => {
            if (isEffect(a) && isEffect(b)) {
                return 0
            } else if (isEffect(a)) {
                return 1
            } else {
                return -1
            }
        })
        const sublist: vModelSelection = []
        vModelObj.push(sublist)
        visitEffects(effects.available, vModelObj, true)
    }
}

function updateCategories(categories_data: Categories) {
    for (let key in categories_data) {
        let features = categories_data[key]
        for (let feature of features) {
            if (!(feature.id in featureSelections.value)) featureSelections.value[feature.id] = []
            const selectionValues = featureSelections.value[feature.id]
            visitEffects(feature.effects!, selectionValues)
        }
        if (key in currentCategoryCollapse.value) {
            const oldObj = categories.value[currentStep.value][key]
            const newObj = categories_data[key]
            if (!_.isEqual(oldObj, newObj)) {
                currentCategoryCollapse.value[key] = false
                for (let featureRef of categoryRefs.value) {
                    if (featureRef.id == key) {
                        featureRef.style.setProperty("height", "")
                        break
                    }
                }
            }
        } else currentCategoryCollapse.value[key] = false
    }
    for (let key in currentCategoryCollapse.value) {
        if (!(key in categories_data)) delete currentCategoryCollapse.value[key]
    }
    categories.value[currentStep.value] = categories_data
}


function prevStep() {
    currentStep.value = Math.max(0, currentStep.value - 1)
}

function setStep(step: number) {
    currentStep.value = step
}

function nextStep() {
    currentStep.value++
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
                <Start class="step-card" :style="{ 'transform': stepTranslate }"></Start>
                <Races class="step-card" :style="{ 'transform': stepTranslate }" @change="updateCategories"></Races>
                <Classes class="step-card" :style="{ 'transform': stepTranslate }" @change="updateCategories">
                </Classes>
                <Backgrounds class="step-card" :style="{ 'transform': stepTranslate }" @change="updateCategories">
                </Backgrounds>
                <!-- <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1>
                <Step1 class="step-card" :style="{ 'transform': stepCardTranslate }" @change="updateRace"></Step1> -->
            </div>
            <div class="mx-8 flex items-stretch h-10 shrink-0 gap-2 mb-8">
                <button @click="prevStep"
                    class="leading-10 w-10 rounded-md bg-gray-400 transition hover:bg-gray-700">👈</button>
                <button v-if="currentStep > 0" @click="nextStep"
                    class="leading-10 flex-grow rounded-md bg-green-600 font-bold text-lg transition hover:bg-green-800">继续</button>
                <button v-else @click="nextStep"
                    class="leading-10 flex-grow rounded-md bg-green-600 font-bold text-lg transition hover:bg-green-800">开始车卡！</button>
            </div>
        </div>
        <div class="bg-slate-800 h-screen flex flex-col items-stretch">
            <h2 v-if="currentStep > 0"
                class="text-3xl mx-4 py-4 my-4 font-bold text-center border-b border-b-slate-50 flex-shrink-0">特质</h2>
            <h2 v-else class="text-3xl mx-4 py-4 my-4 font-bold text-center border-b border-b-slate-50 flex-shrink-0">
                简要说明</h2>
            <div class="flex overflow-x-hidden scroll-xs overflow-y-auto h-64 w-full flex-grow">
                <div class="flex-shrink-0 w-full p-4 text-4xl flex justify-center items-center"
                    :style="{ 'transform': stepTranslate }">
                    是饼🍪。
                </div>
                <div v-for="step in totalSteps" class="flex-shrink-0 w-full p-4"
                    :style="{ 'transform': stepTranslate }">
                    <template v-if="categories[step] != undefined">
                        <div v-for="(features, categoryName) in categories[step]" :key="categoryName"
                            class=" border-2 border-gray-700 rounded-md mb-2">
                            <button
                                class="cursor-pointer hover:bg-slate-700 w-full text-left transition p-2 flex justify-between items-center"
                                :class="{ 'bg-slate-700': !categoryCollapse[step][categoryName] }"
                                @click="collapse(String(categoryName))">
                                <h3 class="text-2xl font-bold"> {{ categoryMapping[categoryName] }} </h3>
                                <div class="relative w-4 h-1 transition"
                                    :class="{ 'rotate-45': !categoryCollapse[step][categoryName] }">
                                    <div class="w-4 h-1 bg-slate-50"></div>
                                    <div class="w-4 h-1 bg-slate-50 absolute top-0 transition rotate-90"></div>
                                </div>
                            </button>
                            <div class="collapse-container scroll-xs" :id="String(categoryName)" ref="categoryRefs"
                                :class="{ collapsed: categoryCollapse[step][categoryName] }">
                                <div v-for="feature, idx in features" :key="idx" class="mx-4 my-2">
                                    <h3 class="font-bold text-lg">{{ feature.name }}</h3>
                                    <p class="description" v-html="feature.description"></p>
                                    <EffectSelection :effects="feature.effects!"
                                        v-model="featureSelections[feature.id]"></EffectSelection>
                                </div>
                            </div>
                        </div>
                    </template>
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


.collapse-container {
    @apply overflow-hidden transition-all;
}
</style>