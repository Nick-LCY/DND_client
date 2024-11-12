<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { SourcedEffectType } from '../../assets/js/context/dataType';
import { Expression, isValue } from '../../assets/js/originalDataType';
import type { Character, CharacterStack, AbilityKeys } from '../../assets/js/context/template';
import { character } from '../../assets/js/context/template';
import { findTarget, findBeforeTarget, deepReset } from '../../assets/js/context/utils';
import { shortNameMapping, nameMapping, skillMapping } from '../../assets/js/mappings';
import { store } from '../../assets/js/store';
import { isExpression } from "../../assets/js/originalDataType";

const props = defineProps<{ activatedEffects: SourcedEffectType[] }>()

function findRootObject(target: string): any {
    let root = target.split(".")[0]
    switch (root) {
        case "character":
            return processedCharacter.value
    }
}

function processExpression(
    expression: Expression,
    reportResult?: { result: string } | undefined
): any {
    let { target, operation, values } = expression
    const localReportResult = reportResult === undefined ? { result: "" } : reportResult
    // Step1, find target
    const root = findRootObject(target)
    const splitedTarget = target.split(".")
    let child: string
    let parent: any
    if (splitedTarget.length == 2) {
        parent = root
        child = splitedTarget[1]
    } else {
        parent = findBeforeTarget(splitedTarget.slice(1).join("."), root)
        child = splitedTarget.slice(-1)[0]
    }
    // Step2, compute value
    const computedValues = []
    for (let v of values) {
        if (isExpression(v)) computedValues.push(processExpression(v))
        else if (isValue(v)) {
            switch (v.type) {
                case "number":
                    computedValues.push(Number(v.value))
                    break
                case "boolean":
                    computedValues.push(v.value === "true" ? true : false)
                    break
                case "string":
                    computedValues.push(v.value)
            }
        }
        else computedValues.push(v)
    }
    // Step3, process operation
    switch (operation) {
        case "+=":
            parent[child] += computedValues[0]
            localReportResult.result = `+${computedValues[0]}`
            break
        case "-=":
            parent[child] -= computedValues[0]
            localReportResult.result = `-${computedValues[0]}`
            break
        case "=":
            parent[child] = computedValues[0]
            localReportResult.result = `=${computedValues[0]}`
            break
        case "+":
            return parent[child] + computedValues[0]
        case "-":
            return parent[child] - computedValues[0]
    }

}

interface sourceRepresentation {
    sources: string[]
    result: string
}

const processedCharacter = ref<Character>(deepReset<Character>(character, {}))
const characterStack = ref<CharacterStack>({
    abilities: { str: [], dex: [], con: [], wis: [], int: [], cha: [] },
    saves: { str: [], dex: [], con: [], wis: [], int: [], cha: [] },
    skills: {
        acrobatics: [], animal_handling: [], arcana: [], athletics: [],
        deception: [], history: [], insight: [], intimidation: [],
        investigation: [], medicine: [], nature: [], perception: [],
        performance: [], persuasion: [], religion: [], sleight_of_hand: [],
        stealth: [], survival: [],
    }
})
const effectSources = ref<{
    abilities: Record<AbilityKeys, sourceRepresentation[]>
    saves: Record<AbilityKeys, sourceRepresentation[]>
    skills: sourceRepresentation[]
}>({
    abilities: { str: [], dex: [], con: [], wis: [], int: [], cha: [] },
    saves: { str: [], dex: [], con: [], wis: [], int: [], cha: [] },
    skills: []
})

watch(() => props.activatedEffects, (v) => {
    // Clean
    deepReset(character, processedCharacter.value)
    for (let type of Object.values(characterStack.value)) {
        for (let entry of Object.values(type)) {
            entry.splice(0)
        }
    }
    for (let type of Object.values(effectSources.value)) {
        if (type instanceof Array) {
            type.splice(0)
            continue
        }
        for (let entry of Object.values(type)) {
            entry.splice(0)
        }
    }
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
    for (let [typeKey, type] of Object.entries(characterStack.value)) {
        for (let [entryKey, entry] of Object.entries(type)) {
            for (let { expression, sources } of entry) {
                const reportResult = { result: "" }
                processExpression(expression, reportResult)
                switch (typeKey) {
                    case "skills":
                        effectSources.value.skills.push({ sources, result: reportResult.result })
                        break;
                    case "abilities":
                        effectSources.value.abilities[entryKey as AbilityKeys].push(
                            { sources, result: reportResult.result }
                        )
                        break;
                    case "saves":
                        effectSources.value.saves[entryKey as AbilityKeys].push(
                            { sources, result: reportResult.result }
                        )
                        break;
                }
            }
        }
    }
})
const skillLength = computed(() => Object.values(processedCharacter.value.skills).filter(v => v != 0).length)


const popoutHidden = ref(true)
const sections = computed(() => {
    const localSections: Record<AbilityKeys, { name: string, content: sourceRepresentation[] }[]> = {
        str: [], dex: [], con: [],
        wis: [], int: [], cha: [],
    }
    for (let [entryName, entry] of Object.entries(effectSources.value)) {
        if (!["abilities", "saves"].includes(entryName)) continue
        for (let [abilityKey, abilityEntries] of Object.entries(entry)) {
            let content = abilityEntries.slice(0)
            switch (entryName) {
                case "abilities":
                    localSections[abilityKey as AbilityKeys].push(
                        { "name": "数值", content }
                    )
                    break
                case "saves":
                    localSections[abilityKey as AbilityKeys].push(
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
</script>
<template>
    <div class="relative">
        <div class="bg-slate-700 flex flex-col items-stretch px-1 w-full h-full relative z-20">
            <div class="text-center font-bold text-lg py-1">属性</div>
            <div v-for="(displayName, abilityName) of shortNameMapping"
                class="text-center flex justify-center border-t border-slate-50 py-1 last:border-b">
                <button
                    class="flex flex-col items-center cursor-pointer select-none w-full hover:bg-slate-500 rounded-sm transition-colors py-1"
                    @click="openPopout(abilityName)">
                    <div>
                        <span>{{ displayName }}</span>
                        <span v-if="processedCharacter.saves[abilityName]">*</span>
                    </div>
                    <span class="text-xl">{{ processedCharacter.abilities[abilityName] }}</span>
                </button>
            </div>
            <div class="border-t text-center font-bold text-lg py-1">技能</div>
            <template v-for="skillValue, skillName in processedCharacter.skills">
                <div class="text-center" v-if="skillValue !== 0">{{ `${skillMapping[skillName]}×${skillValue}` }}</div>
            </template>
            <div v-if="skillLength === 0" class="text-center">无</div>
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
</style>