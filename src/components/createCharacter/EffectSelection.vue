<script lang="ts" setup>
import { computed } from 'vue';
import { Effect, EffectSelection as EffectSelectionType, isEffect } from '../../assets/js/originalDataType';
import { renderMD } from '../../assets/js/renderMarkdown';

interface vModelSelection extends Array<string | vModelSelection> {
    [index: number]: string | vModelSelection
}
const model = defineModel<vModelSelection>({ required: true })
const props = withDefaults(defineProps<{
    effects: (Effect | EffectSelectionType)[] | EffectSelectionType,
    disabled?: boolean
}>(), { disabled: false })

const localEffects = computed(() => props.effects instanceof Array ? props.effects : [props.effects])
interface Selection {
    idx: number
    selection: EffectSelectionType
}
const selectionOnly = computed((): Selection[] => {
    const selections: Selection[] = []
    for (let [idx, effect] of localEffects.value.entries()) {
        if (isEffect(effect)) continue
        selections.push({ idx, selection: effect })
    }
    return selections
})
function shouldCheckboxDisabled(idx: number, checkboxValue: string, choose: number): boolean {
    if (props.disabled) return true
    if (model.value[idx].includes(checkboxValue)) return false
    let counter = 0;
    for (let item of model.value[idx]) {
        if (typeof item === "string") counter++
        else if (item.length > 0) counter++
    }
    if (counter < choose) return false
    return true
}
function shouldSubSelectionDisabled(selectionIdx: number, idx: number, choose: number): boolean {
    if (props.disabled) return true
    if (model.value[selectionIdx][idx].length > 0) return false
    let counter = 0;
    for (let item of model.value[selectionIdx]) {
        if (typeof item === "string") counter++
        else if (item.length > 0) counter++
    }
    if (counter < choose) return false
    return true
}
</script>
<template>
    <div class="ml-4">
        <div v-for="{ idx: selectionIdx, selection } of selectionOnly">
            <template v-for="option, idx of selection.available" :key="idx">
                <label v-if="isEffect(option)" :for="option.id" class="cursor-pointer"
                    :class="{ 'checkbox-disabled': shouldCheckboxDisabled(selectionIdx, option.id, selection.choose) }">
                    <input type="checkbox" :id="option.id" :value="option.id" class="hidden"
                        v-model="model[selectionIdx]"
                        :disabled="shouldCheckboxDisabled(selectionIdx, option.id, selection.choose)">
                    <div class="flex items-center">
                        <div class="checkbox"></div>
                        <div> {{ option.name }}</div>
                    </div>
                    <div class="description pl-6 text-slate-400" v-html="renderMD(option.description)">
                    </div>
                </label>
                <EffectSelection v-else :effects="option"
                    :disabled="shouldSubSelectionDisabled(selectionIdx, idx, selection.choose)"
                    v-model="model[selectionIdx] as vModelSelection">
                </EffectSelection>
            </template>
        </div>
    </div>
</template>
<style scoped>
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

.checkbox-disabled {
    @apply cursor-not-allowed text-gray-400;
}
</style>