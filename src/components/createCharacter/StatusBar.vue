<script setup lang="ts">
import { ref, watch } from 'vue';
import { SourcedEffectType } from '../../assets/js/context/dataType';
import { Expression } from '../../assets/js/originalDataType';
import { character, Character, CharacterStack } from '../../assets/js/context/template';
import { findTarget, findBeforeTarget, deepReset } from '../../assets/js/context/utils';

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
    reportResult?: {result: string} | undefined
): any {
    let { target, operation, values } = expression
    const localReportResult = reportResult === undefined ? {result: ""} : reportResult
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
        if (typeof v === "object") computedValues.push(processExpression(v))
        else computedValues.push(v)
    }
    // Step3, process operation
    switch (operation) {
        case "+=":
            parent[child] += Number(computedValues[0])
            localReportResult.result = `+${Number(computedValues[0])}`
            break
        case "-=":
            parent[child] -= Number(computedValues[0])
            localReportResult.result = `-${Number(computedValues[0])}`
            break
        case "=":
            parent[child] = computedValues[0]
            localReportResult.result = `=${computedValues[0]}`
            break
        case "+":
            return parent[child] + Number(computedValues[0])
        case "-":
            return parent[child] - Number(computedValues[0])
    }

}

const processedCharacter = ref<Character>(deepReset<Character>(character, {}))
const characterStack = ref<CharacterStack>({
    abilities: { str: [], dex: [], con: [], wis: [], int: [], cha: [] },
    saves: { str: [], dex: [], con: [], wis: [], int: [], cha: [] }
})

watch(() => props.activatedEffects, (v) => {
    // Clean
    deepReset(character, processedCharacter.value)
    for (let entry of Object.values(characterStack.value)) {
        for (let abilityEntry of Object.values(entry)) {
            abilityEntry.splice(0)
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
    for (let entry of Object.values(characterStack.value)) {
        for (let abilityEntry of Object.values(entry)) {
            for (let { expression, sources } of abilityEntry) {
                const reportResult = {result: ""}
                processExpression(expression, reportResult)
                console.log(sources, reportResult.result)
            }
        }
    }
})

const nameMapping = {
    str: "力",
    dex: "敏",
    con: "体",
    int: "智",
    wis: "感",
    cha: "魅",
}
</script>
<template>
    <div class="bg-slate-700 flex flex-col items-stretch justify-center px-1">
        <div class="text-center font-bold text-lg py-1">属性</div>
        <div v-for="(displayName, abilityName) of nameMapping"
            class="text-center flex items-center justify-center border-t border-slate-50 py-2 last:border-b">
            <div class="flex flex-col">
                <div>
                    <span>{{ displayName }}</span>
                    <span v-if="processedCharacter.saves[abilityName]">*</span>
                </div>
                <span class="text-xl">{{ processedCharacter.abilities[abilityName] }}</span>
            </div>
        </div>
    </div>
</template>