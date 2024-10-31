<script setup lang="ts">
import { computed, ref } from 'vue';
import { Effect as EffectType } from '../../assets/js/originalDataType';

const props = defineProps<{ activatedEffects: EffectType[] }>()
const expressions = computed(
    () => props.activatedEffects.reduce(
        (prev: string[], current: EffectType): string[] => [...prev, ...current.expressions],
        []
    )
)
interface Ability {
    id: string,
    name: string,
    initValue: number,
    saveProficiencies?: boolean
}
const abilities = ref<Ability[]>([
    { id: "str", name: "力", initValue: 8, saveProficiencies: true },
    { id: "dex", name: "敏", initValue: 8 },
    { id: "con", name: "体", initValue: 8, saveProficiencies: true },
    { id: "int", name: "智", initValue: 8 },
    { id: "wis", name: "感", initValue: 8 },
    { id: "cha", name: "魅", initValue: 8 }
])
</script>
<template>
    <div class="bg-slate-700 flex flex-col items-stretch justify-center px-1">
        <div class="text-center font-bold text-lg py-1">属性</div>
        <div v-for="ability of abilities" class="text-center flex items-center justify-center border-t border-slate-50 py-2 last:border-b">
            <div class="flex flex-col">
                <span>{{ ability.name }}</span>
                <span class="text-xl">{{ ability.initValue }}</span>
            </div>
        </div>
    </div>
</template>