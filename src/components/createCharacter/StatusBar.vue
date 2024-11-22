<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { AbilityKeys, ExpressionResult, ExpressionSource, ExpressionStack, SkillKeys, SourcedEffect } from '../../assets/js/expression/dataType';
import { findTarget } from '../../assets/js/expression/utils';
import { shortNameMapping, nameMapping, skillMapping } from '../../assets/js/mappings';
import { store } from '../../assets/js/store';
import { characterResult, reset as resultReset } from '../../assets/js/expression/expressionResults';
import { characterStack, reset as stackReset } from '../../assets/js/expression/expressionStacks';
import { characterSource, reset as sourceReset } from '../../assets/js/expression/expressionSource';
import { processExpression } from '../../assets/js/expression/processExpression';

const props = defineProps<{ activatedEffects: SourcedEffect[] }>()

interface sourceRepresentation {
    sources: string[]
    result: string
}


watch(() => props.activatedEffects, (v) => {
    // Clean
    resultReset("character")
    stackReset("character")
    sourceReset("character")
    // Push
    for (let sourcedEffect of v) {
        for (let expression of sourcedEffect.effect.expressions) {
            const { target } = expression
            let target_obj = target.split(".")[0]
            switch (target_obj) {
                case "character":
                    findTarget(target.split(".").slice(1).join("."), characterStack.value).push({
                        sources: sourcedEffect.sources,
                        expression
                    })
            }
        }
    }
    // Compute
    function forEach(expStack: ExpressionStack, expSource: ExpressionSource) {
        for (let [expStackKey, expStackVal] of Object.entries(expStack)) {
            if (expStackVal instanceof Array) {
                let expressionCategories: Record<string, (string | boolean | number)[]> = {
                    set: [], change: [], none: []
                }
                let target: Record<string, any>, targetKey: string
                expStackVal.forEach(i => {
                    let { expression, sources } = i
                    let values, modificationType
                    ({ values, target, key: targetKey, modificationType } = processExpression(expression))
                    expressionCategories[modificationType].push(values[0])
                    if (!(expSource[expStackKey] instanceof Array)) expSource[expStackKey] = []
                    let repr: string
                    switch (typeof values[0]) {
                        case "number":
                            repr = String(values[0])
                            if (values[0] > 0) repr = "+" + repr
                            break
                        case "boolean":
                            repr = ""
                            break
                        case "string":
                            repr = values[0]
                    }
                    expSource[expStackKey].push({ sources, result: repr })
                })
                if (expStackVal.length !== 0) {
                    let finalValue = Math.max(
                        expressionCategories.change.reduce((p: number, c) => p + Number(c), 0),
                        expressionCategories.set.reduce((p: number, c) => Math.max(p, Number(c)), 0)
                    )
                    switch (typeof finalValue) {
                        case "number":
                            target![targetKey!] += finalValue
                            break
                        default:
                            target![targetKey!] = finalValue
                    }
                }

            } else {
                if (!expSource[expStackKey] || expSource[expStackKey] instanceof Array) expSource[expStackKey] = {}
                forEach(expStackVal, expSource[expStackKey])
            }
        }
    }
    forEach(characterStack.value, characterSource.value)
    // Frontend Effects
    store.characterEffects.class.forEach(v => v(characterResult.value))
    store.characterEffects.spell_slots.forEach(v => v(characterResult.value))
})
const skillCategory: Record<AbilityKeys, SkillKeys[]> = {
    str: ["athletics"],
    dex: ["acrobatics", "sleight_of_hand", "stealth"],
    con: [],
    int: ["arcana", "history", "investigation", "religion", "nature"],
    wis: ["animal_handling", "insight", "medicine", "survival", "perception"],
    cha: ["deception", "intimidation", "performance", "persuasion"]
}


const popoutHidden = ref(true)
const sections = computed(() => {
    const localSections: { [key: string]: { name: string, content: sourceRepresentation[] }[] } = {
        str: [], dex: [], con: [],
        wis: [], int: [], cha: [],
    }
    for (let [entryName, entry] of Object.entries(characterSource.value)) {
        if (!["abilities", "saves"].includes(entryName)) continue
        for (let [abilityKey, abilityEntries] of Object.entries(entry)) {
            let content = abilityEntries.slice(0)
            switch (entryName) {
                case "abilities":
                    localSections[abilityKey].push(
                        { "name": "数值", content }
                    )
                    break
                case "saves":
                    localSections[abilityKey].push(
                        { "name": "豁免熟练项", content }
                    )
                    break
            }
        }
    }
    return localSections
})
const selectedSections = computed(() => sections.value[currentOpen.value])
const currentOpen = ref<AbilityKeys>("str")
function openPopout(abilityName: AbilityKeys) {
    if (abilityName === currentOpen.value && !popoutHidden.value) {
        popoutHidden.value = true
    } else {
        popoutHidden.value = false
        currentOpen.value = abilityName
    }
}

const statusPannelOpen = ref(false)
</script>
<template>
    <div class="status-container" :class="{ open: statusPannelOpen }">
        <div class="status-bar">
            <div class="relative z-20 px-1 bg-slate-700">
                <div class="text-center font-bold text-lg py-1">属性</div>
                <div v-for="(displayName, abilityName) of shortNameMapping"
                    class="text-center flex justify-center border-t border-slate-50 py-1 last:border-b">
                    <button
                        class="flex flex-col items-center cursor-pointer select-none w-full hover:bg-slate-500 rounded-sm transition-colors py-1 gap-1"
                        @click="openPopout(abilityName)">
                        <!-- TODO: Any way to handle "as"? -->
                        <div class="relative"
                            :class="{ 'save-proficiency': (characterResult.saves as ExpressionResult)[abilityName] }">
                            {{ displayName }}
                        </div>
                        <!-- TODO: Any way to handle "as"? -->
                        <span class="text-xl">{{ (characterResult.abilities as ExpressionResult)[abilityName] }}</span>
                    </button>
                </div>
            </div>
            <div class="popout flex flex-col items-stretch" :class="{ 'popout-hidden': popoutHidden }">
                <button
                    class="cursor-pointer select-none text-center flex-shrink-0 bg-slate-600 transition hover:bg-slate-500 text-3xl"
                    @click="popoutHidden = true">
                    ×
                </button>
                <div class="h-1 flex-grow flex flex-col" :class="{ loading: store.loading }">
                    <div class="text-xl text-center mt-2 flex-shrink-0">{{ nameMapping[currentOpen] }}构成</div>
                    <div class="scroll-xs overflow-y-auto p-2">
                        <div v-for="(section, idx) of selectedSections" :key="idx" class="mb-2">
                            <div class="text-lg font-bold">{{ section.name }}</div>
                            <template v-if="section.content.length !== 0">
                                <div v-for="content of section.content" class="section-content">
                                    <div class="text-sm"> {{ content.sources.join(">") }} </div>
                                    <div> {{ content.result }} </div>
                                </div>
                            </template>
                            <div v-else class="text-sm section-content">无相关特性</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="status-pannel">
            <div class="font-bold text-center text-lg border-b py-1">技能</div>
            <div v-for="value, categoryKey of skillCategory" :key="categoryKey"
                class="flex flex-col items-stretch flex-grow basis-1">
                <div class="skill-container">
                    <div v-for="skillKey of value" :key="skillKey" class="basis-1/3 flex-shrink-0">
                        {{ skillMapping[skillKey] }}
                        <!-- TODO: Any way to handle "as"? -->
                        ×{{ (characterResult.skills as ExpressionResult)[skillKey] }}
                    </div>
                </div>
            </div>
        </div>
        <div class="px-1 py-2 text-center text-lg flex flex-col justify-center">
            <div class="font-bold">HP</div>
            <div class="text-xl mb-3">20</div>
            <div class="font-bold">AC</div>
            <div class="text-xl mb-3">13</div>
            <div class="font-bold">先攻</div>
            <div class="text-xl mb-3">+6</div>
            <div class="font-bold">速度</div>
            <div class="text-xl">25</div>
        </div>
        <div class="details">
            <div class="text-lg font-bold my-1 py-1 text-center border-b">法术点</div>
            <div class="spell-slots-display">
                <template v-for="spellSlot, spellLevel in characterResult.spell_slots">
                    <!-- TODO: AS ANY!?? ANYONE HELP! -->
                    <div class="w-1/3 text-center" v-if="(spellSlot as any).capacity !== 0">
                        {{ `${spellLevel}环：${(spellSlot as any).capacity}🔷` }}
                    </div>
                </template>
                <div class="nothing">无法术点</div>
            </div>
            <div class="text-lg font-bold my-1 py-1 text-center border-b">熟练项</div>
            <div class="spell-slots-display">
                <div class="nothing">无熟练项</div>
            </div>
            <div class="text-lg font-bold my-1 py-1 text-center border-b">语言</div>
            <div class="spell-slots-display">
                <div class="nothing">未知语言</div>
            </div>
        </div>
        <div class="flex flex-col items-stretch pb-2 gap-2 px-1">
            <button @click="statusPannelOpen = !statusPannelOpen" class="button">
                {{ statusPannelOpen ? "折叠" : "展开" }}
            </button>
            <button class="button">设置</button>
        </div>
    </div>
</template>
<style scoped>
.popout {
    @apply absolute z-10 w-64 h-96 top-4 bg-slate-800 rounded-lg shadow-lg;
    @apply border-2 border-slate-600;
    @apply transition-all overflow-hidden;
    left: -17.3rem;
}

.popout-hidden {
    left: 0;
}

.section-content {
    @apply hover:bg-slate-700 p-1 rounded-sm transition-colors;
}

.button {
    @apply py-2 font-bold border-2 rounded-md border-slate-500;
    @apply flex items-center justify-center;
    @apply transition hover:bg-slate-500;
    @apply select-none cursor-pointer;
}

.status-container {
    @apply bg-slate-700 grid;
    grid-template-columns: 50px 300px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        ". ."
        ". a"
        ". a";
    transition: width 150ms ease;
    width: 50px;
}

.details {
    grid-area: a;
    @apply px-1;
}

.open {
    width: 350px;
}

.status-bar {
    @apply relative flex-shrink-0;
    width: 50px;
}

.open>.status-bar>div {
    @apply pr-0;
}

.status-pannel {
    @apply relative z-20 w-full bg-slate-700 pr-1 flex-shrink-0 flex flex-col items-stretch;
    width: 300px;
}

.skill-container {
    @apply border-b pl-4 py-1 flex flex-wrap gap-y-1 items-center flex-grow;
}

.save-proficiency::after {
    content: "";
    @apply w-6 h-full border absolute -left-1 bottom-0 rounded-sm;
}

.spell-slots-display {
    @apply flex flex-wrap gap-y-2 mt-2;
}

.nothing {
    @apply w-full text-center hidden;
}

.spell-slots-display>div:first-child.nothing {
    display: block;
}
</style>