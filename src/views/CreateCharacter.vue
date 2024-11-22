<script lang="ts" setup>
import { ref, computed } from 'vue';
import Start from '../components/createCharacter/Start.vue';
import Races from '../components/createCharacter/Races.vue';
import Classes from '../components/createCharacter/Classes.vue';
import BuyPoint from '../components/createCharacter/BuyPoint.vue';
// import Backgrounds from '../components/createCharacter/Backgrounds.vue';
import { Categories, ConditionalFeature, Feature } from '../assets/js/categories';
import {
    Effect as EffectType,
    EffectGroup as EffectGroupType,
    EffectSelection as EffectSelectionType,
    EffectGroupDict as EffectGroupDictType,
    isEffect,
    isEffectSelection,
    isEffectGroupDict
} from '../assets/js/originalDataType';
import { vModelSelection } from '../assets/js/selections';
import EffectGroup from '../components/createCharacter/EffectGroup.vue';
import StatusBar from '../components/createCharacter/StatusBar.vue';
import { store } from '../assets/js/store';
import { SourcedEffect } from '../assets/js/expression/dataType';
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
    class_level_traits: "职业等级特质",
    class_proficiencies: "职业熟练项",
    class_equipments: "职业初始装备",
    subclass_traits: "子职业特质",
    subclass_level_traits: "子职业等级特质",
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
const featureSelections = ref<{ [key: string]: { [key: number]: vModelSelection } }>({});
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
        // 150ms == Tailwind default animation duration
        setTimeout(() => {
            targetElement!.style.setProperty("height", "")
        }, 151)
    }
    setTimeout(() => {
        currentCategoryCollapse.value[categoryName] = !currentCollapse
    }, 1)
}

function visitEffects(effects: EffectGroupType | EffectGroupDictType, vModelObj: vModelSelection, inSelection: boolean = false) {
    if (isEffectGroupDict(effects)) effects = effects.group
    for (let effect of effects) {
        if (isEffect(effect)) {
            let value = 0
            if (!inSelection) value = 1
            vModelObj.selectedString.push({ id: effect.id, value })
        } else if (isEffectSelection(effect)) {
            const subSelection: vModelSelection = {
                selectedGroup: [],
                selectedSelection: [],
                selectedString: []
            }
            vModelObj.selectedSelection.push(subSelection)
            visitEffects(effect.available, subSelection, true)
        } else {
            const subSelection: vModelSelection = {
                selectedGroup: [],
                selectedSelection: [],
                selectedString: []
            }
            vModelObj.selectedGroup.push(subSelection)
            visitEffects(effect, subSelection, inSelection)
        }
    }
}

function updateCategories(categories_data: Categories) {
    for (let key in categories_data) {
        let features = categories_data[key]
        for (let [idx, feature] of features.entries()) {
            if (!(feature.id in featureSelections.value)) {
                featureSelections.value[feature.id] = []
            }
            if (!(idx in featureSelections.value[feature.id])) {
                featureSelections.value[feature.id][idx] = {
                    selectedGroup: [],
                    selectedSelection: [],
                    selectedString: []
                }
                const selectionValues = featureSelections.value[feature.id][idx]
                visitEffects(feature.effects, selectionValues)
            }
        }
        if (key in currentCategoryCollapse.value) {
            const oldObj = categories.value[currentStep.value][key]
            const newObj = categories_data[key]
            // FIXME: compare between ConditionalFeatures always false
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

const activatedEffects = computed(() => {
    function findSelectedEffectIds(obj: vModelSelection): string[] {
        const selectedEffects: string[] = []
        for (let selectedEffect of obj.selectedString) {
            for (let i = 0; i < selectedEffect.value; i++) selectedEffects.push(selectedEffect.id)
        }
        for (let selection of obj.selectedSelection) selectedEffects.push(...findSelectedEffectIds(selection))
        for (let group of obj.selectedGroup) selectedEffects.push(...findSelectedEffectIds(group))
        return selectedEffects
    }
    function findAllEffects(obj: EffectGroupType | EffectSelectionType | EffectGroupDictType): { [key: string]: EffectType } {
        let effects: { [key: string]: EffectType } = {}
        let list: EffectGroupType
        if (isEffectSelection(obj)) list = obj.available
        else if (isEffectGroupDict(obj)) list = obj.group
        else list = obj
        for (let i of list) {
            if (isEffect(i)) effects[i.id] = i
            else effects = {
                ...effects,
                ...findAllEffects(i)
            }
        }
        return effects
    }
    function findFeatures(id: string): { idx: number, feature: Feature, categoryName: string }[] {
        const features: { idx: number, feature: Feature, categoryName: string }[] = []
        for (let step in categories.value) {
            for (let [categoryName, category] of Object.entries(categories.value[step])) {
                for (let [idx, feature] of category.entries()) {
                    if (id == feature.id) {
                        if (
                            (<ConditionalFeature>feature).condition === undefined
                            || (<ConditionalFeature>feature).condition()
                        ) features.push({ idx, feature, categoryName })
                    }
                }
            }
        }
        return features
    }
    const effects: SourcedEffect[] = []
    for (let featureId in featureSelections.value) {
        let features = findFeatures(featureId)
        for (let { idx, feature, categoryName } of features) {
            let selectedEffectIds = findSelectedEffectIds(featureSelections.value[featureId][idx])
            let effectDict = findAllEffects(feature.effects)
            for (let effectId of selectedEffectIds)
                effects.push({ sources: [...feature.sources, categoryMapping[categoryName], feature.name], effect: effectDict[effectId] })
        }
    }
    return effects
})
</script>
<template>
    <main class="overflow-hidden">
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
                <BuyPoint class="step-card" :style="{ 'transform': stepTranslate }"
                    :activatedEffects="activatedEffects"></BuyPoint>
                <!-- <Backgrounds class="step-card" :style="{ 'transform': stepTranslate }" @change="updateCategories">
                </Backgrounds> -->
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
            <div class="flex overflow-hidden h-64 w-full flex-grow" :class="{ loading: store.loading }">
                <div class="flex-shrink-0 w-full p-4 text-4xl flex justify-center items-center"
                    :style="{ 'transform': stepTranslate }">
                    是饼🍪。
                </div>
                <div v-for="step in totalSteps" class="flex-shrink-0 w-full p-4 overflow-y-scroll scroll-xs"
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
                                <template v-for="feature, idx in features" :key="idx">
                                    <div v-if="(<ConditionalFeature>feature).condition === undefined || (<ConditionalFeature>feature).condition()"
                                        class="mx-4 my-2">
                                        <h3 class="font-bold text-lg">{{ feature.name }}</h3>
                                        <p class="description" v-html="feature.description"></p>
                                        <EffectGroup :id-prefix="`${currentStep}-${categoryName}-${idx}`"
                                            :effects="feature.effects" v-model="featureSelections[feature.id][idx]">
                                        </EffectGroup>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <StatusBar :activatedEffects="activatedEffects"></StatusBar>
    </main>
</template>
<style scoped>
main {
    display: grid;
    grid-template-columns: 500px minmax(0, 1fr) auto;
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