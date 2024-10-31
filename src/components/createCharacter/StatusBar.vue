<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Effect as EffectType } from '../../assets/js/originalDataType';
import Character from '../../assets/js/context/character';

const props = defineProps<{ activatedEffects: EffectType[] }>()
const expressions = computed(
    () => props.activatedEffects.reduce(
        (prev: string[], current: EffectType): string[] => [...prev, ...current.expressions],
        []
    )
)

const character = ref(new Character())
watch(expressions, () => {
    character.value.reset()
    function callInContext(js: string) {
        return function (js: string) { return eval(js) }.call({ character: character.value }, js)
    }
    for (let expression of expressions.value) {
        callInContext(expression)
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
        <div v-for="(value, ability) in character.abilities"
            class="text-center flex items-center justify-center border-t border-slate-50 py-2 last:border-b">
            <div class="flex flex-col">
                <div>
                    <span>{{ nameMapping[ability] }}</span>
                    <span v-if="character.saves[ability]">*</span>
                </div>
                <span class="text-xl">{{ value }}</span>
            </div>
        </div>
    </div>
</template>