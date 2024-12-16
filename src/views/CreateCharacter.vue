<script lang="ts" setup>
import { ref, computed } from 'vue';
import { updateCharacter } from '../assets/js/expression/update';
import Start from '../components/createCharacter/Start.vue';
import Races from '../components/createCharacter/Races.vue';
import Classes from '../components/createCharacter/Classes.vue';
import BuyPoint from '../components/createCharacter/BuyPoint.vue';
import Backgrounds from '../components/createCharacter/Backgrounds.vue';
import Export from '../components/createCharacter/Export.vue';
import Character from './Character.vue';
import { Categories, ConditionalFeature, Feature } from '../assets/js/categories';
import {
    Effect as EffectType,
    EffectGroup as EffectGroupType,
    EffectSelection as EffectSelectionType,
    EffectGroupDict as EffectGroupDictType,
    isEffect,
    isEffectSelection,
    isEffectGroupDict,
    isSpellListEffect,
    SpellListEffect,
    isSpell,
    isSpellList,
    Spell,
    isConstraintSpell,
    SpellWithLevelConstraint,
} from '../assets/js/originalDataType';
import { vModelSelection } from '../assets/js/selections';
import EffectGroup from '../components/createCharacter/EffectGroup.vue';
import StatusBar from '../components/createCharacter/StatusBar.vue';
import { store } from '../assets/js/store';
import { SourcedEffect } from '../assets/js/expression/dataType';
import { characterResult } from '../assets/js/expression/expressionResults';
import { spellList } from '../assets/js/expression/spellLists';
import _ from "lodash";
import { renderMD } from '../assets/js/renderMarkdown';
import { categoryMapping } from '../assets/js/mappings';

const activatedSpellList = computed(() => {
    interface SpellPart {
        name: string, spells: { [key: number]: Spell[] }
    }
    interface SpellList {
        known: number
        spellParts: SpellPart[]
        sources: string[]
    }
    let currentLevel = (characterResult.value.class as { level: number }).level
    let currentSpellLevel = Object.entries(
        characterResult.value.spell_slots as { [key: number]: { capacity: number } }).filter(
            ([_, v]) => v.capacity > 0
        ).reduce(
            (p, c) => Math.max(p, Number(c[0])), 0
        )
    function addSpell(
        targetSpellPart: SpellPart,
        spell: Spell | SpellWithLevelConstraint,
        spellListIdx: number,
        knownAll: boolean,
        cantripOnly: boolean | undefined,
        spellOnly: boolean | undefined
    ) {
        if (isSpell(spell) && cantripOnly && spell.spell_level > 0) return
        if (isSpell(spell) && spellOnly && spell.spell_level === 0) return
        if (isConstraintSpell(spell) && cantripOnly && spell.spell.spell_level > 0) return
        if (isConstraintSpell(spell) && spellOnly && spell.spell.spell_level === 0) return
        if (isSpell(spell) && currentSpellLevel < spell.spell_level) return
        if (isConstraintSpell(spell) && currentLevel < spell.level) return

        if (isConstraintSpell(spell)) spell = spell.spell
        if (targetSpellPart.spells[spell.spell_level] === undefined)
            targetSpellPart.spells[spell.spell_level] = []

        targetSpellPart.spells[spell.spell_level].push(spell)
        if (knownAll) knownSpells.value[spellListIdx].push(spell.id)
    }
    const results = [] as SpellList[]
    let idx = 0
    for (let sourcedSpellList of spellList.value) {
        // 初始化选择的法术
        knownSpells.value[idx] = []
        for (let spellListItem of sourcedSpellList.effect.spells) {
            // 在写了level相关的字段的时候判断是否生效
            if (spellListItem.level !== undefined && currentLevel !== spellListItem.level) continue
            if (spellListItem.start_level !== undefined && currentLevel < spellListItem.start_level) continue
            if (spellListItem.end_level !== undefined && currentLevel >= spellListItem.end_level) continue

            let result: SpellList = {
                known: 0,
                spellParts: [] as SpellPart[],
                sources: sourcedSpellList.sources
            }
            let others: SpellPart = { name: "其他", spells: {} }
            // 如果没有写known为多少，则自动学会所有列出的法术
            // 用-1标记学会所有法术
            let knownAll = spellListItem.known === undefined
            if (!knownAll) result.known = spellListItem.known!
            else result.known = -1
            if (spellListItem.from instanceof Array) {
                for (let spellOrList of spellListItem.from) {
                    if (isSpell(spellOrList) || isConstraintSpell(spellOrList)) addSpell(
                        others,
                        spellOrList,
                        idx,
                        knownAll,
                        spellListItem.cantrip_only,
                        spellListItem.spell_only
                    )
                    else if (isSpellList(spellOrList)) {
                        let partOfSpellList: SpellPart = { name: spellOrList.name, spells: {} }
                        for (let spell of spellOrList.list) addSpell(
                            partOfSpellList,
                            spell,
                            idx,
                            knownAll,
                            spellListItem.cantrip_only,
                            spellListItem.spell_only
                        )
                        result.spellParts.push(partOfSpellList)
                    }
                }
            } else {
                let spellPart: SpellPart = { name: spellListItem.from.name, spells: {} }
                for (let spell of spellListItem.from.list) addSpell(
                    spellPart,
                    spell,
                    idx,
                    knownAll,
                    spellListItem.cantrip_only,
                    spellListItem.spell_only
                )
                result.spellParts.push(spellPart)
            }
            results.push(result)
        }
        idx++
    }
    if (categoryCollapse.value[4] === undefined) categoryCollapse.value[4] = {}
    return results
})
const knownSpells = ref<string[][]>([])
function spellShouldBeDisabled(spellId: string, spellListIdx: number) {
    if (knownSpells.value[spellListIdx].length >= activatedSpellList.value[spellListIdx].known) {
        return !knownSpells.value[spellListIdx].includes(spellId)
    }
    return false
}
const currentSpellDetil = ref({ id: "", name: "法术详情", description: "点击法术以查看详情" })
function switchSpellDetail(id: string, name: string, description: string) {
    currentSpellDetil.value.id = id
    currentSpellDetil.value.name = name
    currentSpellDetil.value.description = renderMD(description)
}

const categories = ref<{ [key: number]: Categories }>({});
const currentCategoryCollapse = computed(
    () => {
        if (!(currentStep.value in categoryCollapse.value)) categoryCollapse.value[currentStep.value] = {}
        return categoryCollapse.value[currentStep.value]
    }
)
const currentStep = ref<number>(0);
const totalSteps = ref<number>(5);
const stepTranslate = computed(() => {
    return `translate(${currentStep.value * -100}%, 0)`
})
const featureSelections = ref<{ [key: string]: { [key: number]: vModelSelection } }>({});
const categoryRefs = ref<Array<HTMLElement>>([]);
const connectedCategroyRefs = computed(() => categoryRefs.value.filter(v => v.isConnected))
const categoryCollapse = ref<{ [step: number]: { [category: string]: boolean } }>({})

function collapse(categoryName: string) {
    let currentCollapse = currentCategoryCollapse.value[categoryName]
    let targetElement: HTMLElement
    for (let featureRef of connectedCategroyRefs.value) {
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
        if (currentCategoryCollapse.value[categoryName] === undefined)
            currentCategoryCollapse.value[categoryName] = false
        currentCategoryCollapse.value[categoryName] = !currentCollapse
    }, 1)
}

function visitEffects(effects: EffectGroupType | EffectGroupDictType, vModelObj: vModelSelection, inSelection: boolean = false) {
    if (isEffectGroupDict(effects)) effects = effects.group
    for (let effect of effects) {
        if (isEffect(effect) || isSpellListEffect(effect)) {
            let value = inSelection ? 0 : 1
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
                for (let featureRef of connectedCategroyRefs.value) {
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
    function findAllEffects(obj: EffectGroupType | EffectSelectionType | EffectGroupDictType): { [key: string]: EffectType | SpellListEffect } {
        let effects: { [key: string]: EffectType | SpellListEffect } = {}
        let list: EffectGroupType
        if (isEffectSelection(obj)) list = obj.available
        else if (isEffectGroupDict(obj)) list = obj.group
        else list = obj
        for (let i of list) {
            if (isEffect(i) || isSpellListEffect(i)) effects[i.id] = i
            else if (isSpellListEffect(i)) continue
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
        for (let { idx, feature } of features) {
            let selectedEffectIds = findSelectedEffectIds(featureSelections.value[featureId][idx])
            let effectDict = findAllEffects(feature.effects)
            for (let effectId of selectedEffectIds) {
                if (effectDict[effectId] !== undefined)
                    effects.push({ sources: [...feature.sources, feature.name], effect: effectDict[effectId] })
            }
        }
    }
    return effects
})

const activatedFeatures = computed(() => {
    interface Result {
        name: string
        description: string
        sources: string[]
    }

    let results: Result[] = []
    for (let page of Object.values(categories.value)) {
        for (let features of Object.values(page)) {
            for (let feature of features) {
                if (
                    (<ConditionalFeature>feature).condition &&
                    !(<ConditionalFeature>feature).condition()
                ) continue
                const result: Result = {
                    name: feature.name,
                    description: feature.description,
                    sources: feature.sources,
                }
                results.push(result)
            }
        }
    }
    return results
})
updateCharacter(activatedEffects.value)
</script>
<template>
    <main class="overflow-hidden">
        <div class="bg-slate-600 flex flex-col justify-start items-stretch h-screen relative z-10">
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
                <BuyPoint class="step-card" :style="{ 'transform': stepTranslate }"
                    :activatedEffects="activatedEffects"></BuyPoint>
                <Export class="step-card" :style="{ 'transform': stepTranslate }"></Export>
            </div>
            <div class="mx-8 flex items-stretch h-10 shrink-0 gap-2 mb-8">
                <button @click="prevStep" v-if="currentStep > 0"
                    class="leading-10 w-10 rounded-md bg-gray-400 transition hover:bg-gray-700">👈</button>
                <button v-if="currentStep > 0" @click="nextStep"
                    class="leading-10 flex-grow rounded-md bg-green-600 font-bold text-lg transition hover:bg-green-800">继续</button>
                <button v-else @click="nextStep"
                    class="leading-10 flex-grow rounded-md bg-green-600 font-bold text-lg transition hover:bg-green-800">开始车卡！</button>
            </div>
        </div>
        <div class="bg-slate-800 h-screen flex flex-col items-stretch">
            <div v-if="currentStep === 0" class="step-detail-title">
                <h2> 简要说明 </h2>
            </div>
            <div v-else-if="currentStep > 0 && currentStep < 4" class="step-detail-title">
                <h2>特质</h2>
            </div>
            <div v-else-if="currentStep === 4" class="step-detail-title">
                <h2>
                    学习法术
                </h2>
            </div>
            <div class="flex overflow-hidden h-64 w-full flex-grow" :class="{ loading: store.loading }">
                <div class="flex-shrink-0 w-full p-4 text-4xl flex justify-center items-center"
                    :style="{ 'transform': stepTranslate }">
                    是饼🍪。
                </div>
                <div v-for="step in [1, 2, 3]" class="step-details scroll-xs" :style="{ 'transform': stepTranslate }">
                    <template v-if="categories[step] != undefined">
                        <div v-for="(features, categoryName) in categories[step]" :key="categoryName"
                            class=" border-2 border-gray-700 rounded-md mb-2">
                            <button class="collapse-button"
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
                <div class="step-details spell-selection !p-0" :style="{ 'transform': stepTranslate }">
                    <div class="overflow-y-scroll mx-4 pr-2 pt-4 scroll-xs">
                        <div v-for="spellList, idx of activatedSpellList"
                            class="border-2 border-gray-700 rounded-md mb-2" :key=idx>
                            <button class="collapse-button"
                                :class="{ 'bg-slate-700': !categoryCollapse[4][`spell-lists-${idx}`] }"
                                @click="collapse(`spell-lists-${idx}`)">
                                <div>
                                    <div class="text-xl font-bold" v-if="spellList.known !== -1">
                                        学习法术
                                        ({{ knownSpells[idx].length }} / {{ spellList.known }})
                                    </div>
                                    <div class="text-xl font-bold" v-else>
                                        学习法术 (全部)
                                    </div>
                                    <div class="text-gray-400 text-xs">法表来源：{{ spellList.sources.join(" > ") }}</div>
                                </div>
                                <div class="relative w-4 h-1 transition"
                                    :class="{ 'rotate-45': !categoryCollapse[4][`spell-lists-${idx}`] }">
                                    <div class="w-4 h-1 bg-slate-50"></div>
                                    <div class="w-4 h-1 bg-slate-50 absolute top-0 transition rotate-90"></div>
                                </div>
                            </button>
                            <div class="collapse-container" :id="`spell-lists-${idx}`"
                                :class="{ collapsed: categoryCollapse[4][`spell-lists-${idx}`] }" ref="categoryRefs">
                                <div v-for="spellPart, spellPartIdx of spellList.spellParts" class="mx-4 my-2"
                                    :key="spellPartIdx">
                                    <div class="text-lg font-bold my-1">{{ spellPart.name }}：</div>
                                    <div v-for="spells, spellLevel of spellPart.spells" :key="spellLevel">
                                        <template v-if="spells.length !== 0">
                                            <div class="font-bold my-1 ml-2" v-if="spellLevel > 0">{{ spellLevel }} 环：
                                            </div>
                                            <div class="font-bold my-1 ml-2" v-else>戏法：</div>
                                            <div class="flex flex-wrap gap-2 ml-2">
                                                <div v-for="spell, spellIdx of spells" :key="spellIdx"
                                                    class="border overflow-hidden rounded-md border-slate-600 select-none flex items-stretch">
                                                    <button
                                                        class="px-2 py-1 hover:bg-slate-600 transition text-center cursor-pointer"
                                                        :class="{ 'text-gray-400': spellShouldBeDisabled(spell.id, idx), 'bg-slate-600': spell.id === currentSpellDetil.id }"
                                                        @click="switchSpellDetail(spell.id, spell.name, spell.description)">
                                                        {{ spell.name }}
                                                    </button>
                                                    <input class="hidden" type="checkbox"
                                                        :id="`${idx}-${spellPartIdx}-${spellLevel}-${spellIdx}`"
                                                        v-model="knownSpells[idx]" :value="spell.id"
                                                        :disabled="spellShouldBeDisabled(spell.id, idx)">
                                                    <label v-if="spellList.known !== -1"
                                                        class="bg-slate-600 flex items-center justify-center px-2 relative cursor-pointer transition"
                                                        :class="{ '!cursor-not-allowed': spellShouldBeDisabled(spell.id, idx) }"
                                                        :for="`${idx}-${spellPartIdx}-${spellLevel}-${spellIdx}`">
                                                        <div class="w-3 h-0.5 bg-slate-50"
                                                            :class="{ '!bg-gray-400': spellShouldBeDisabled(spell.id, idx) }">
                                                        </div>
                                                        <div class="w-3 h-0.5 bg-slate-50 rotate-90 absolute transition"
                                                            :class="{ '!bg-gray-400': spellShouldBeDisabled(spell.id, idx) }">
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="spell-details">
                        <div class="text-xl font-bold mb-2 pb-1 border-b-2">{{ currentSpellDetil.name }}</div>
                        <div class="description overflow-auto scroll-xs pr-1" v-html="currentSpellDetil.description">
                        </div>
                    </div>
                </div>
                <Character :style="{ 'transform': stepTranslate }" :features="activatedFeatures"></Character>
            </div>
        </div>
        <StatusBar :class="{ 'status-bar-collapse': currentStep === 5 }" :activatedEffects="activatedEffects">
        </StatusBar>
    </main>
</template>
<style scoped>
main {
    display: grid;
    grid-template-columns: 500px minmax(0, 1fr) auto;
    height: 100vh;
    @apply text-slate-50;
}

.status-bar-collapse {
    @apply !w-0;
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

.collapse-button {
    @apply cursor-pointer hover:bg-slate-700 w-full text-left transition p-2 flex justify-between items-center;
}

.collapse-container {
    @apply overflow-hidden transition-all;
}

.step-details {
    @apply flex-shrink-0 w-full p-4 overflow-y-scroll;
}

.spell-selection {
    @apply grid overflow-hidden;
    grid-template-rows: 1fr 300px;
}

input[type="checkbox"]:checked+label {
    @apply bg-red-500;
}

input[type="checkbox"]:checked+label div {
    @apply rotate-0;
}

.disabled {
    @apply text-gray-400 cursor-not-allowed;
}

.spell-details {
    @apply overflow-hidden flex flex-col transition-all py-2 px-4 bg-slate-800 relative z-10;
    box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.5);
}

.step-detail-title {
    @apply text-3xl p-4 pt-8 font-bold text-center flex-shrink-0;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}

.step-detail-title h2 {
    @apply border-b-2 border-slate-50 pb-4;
}
</style>