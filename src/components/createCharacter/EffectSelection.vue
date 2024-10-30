<script lang="ts" setup>
import { computed } from 'vue';
import type {
    EffectSelection as EffectSelectionType,
    Effect as EffectType,
    EffectGroup as EffectGroupType
} from '../../assets/js/originalDataType';
import { isEffect, isEffectSelection, isEffectGroup } from '../../assets/js/originalDataType';
import { renderMD } from '../../assets/js/renderMarkdown';
import EffectGroup from '../createCharacter/EffectGroup.vue';
import type { vModelSelection } from '../../assets/js/selections';
import { filterByType, isSelected, selectedCount } from '../../assets/js/selections';

const model = defineModel<vModelSelection>({ required: true })
const props = withDefaults(defineProps<{
    effect: EffectSelectionType,
    idPrefix: string,
    disabled?: boolean
}>(), { disabled: false })

const selectionIndex = computed(
    () => filterByType<EffectSelectionType>(props.effect.available, isEffectSelection)
)
const groupIndex = computed(
    () => filterByType<EffectGroupType>(props.effect.available, isEffectGroup)
)
const effectIndex = computed(
    () => filterByType<EffectType>(props.effect.available, isEffect)
)
const isFull = computed(() => selectedCount(model.value) >= props.effect.choose)
function shouldDisabled(selection: vModelSelection | string): boolean {
    if (props.disabled) return true
    if (isFull.value) {
        if (typeof selection === "string") {
            if (!model.value.selectedString.includes(selection)) return true
        } else {
            if (!isSelected(selection)) return true
        }
    }
    return false
}
</script>
<template>
    <div>
        <div class="font-bold text-green-500"
            :class="{ warning: selectedCount(model) < effect.choose, disabled: disabled }">
            [{{ selectedCount(model) }} / {{ effect.choose }}]
        </div>
        <label v-for="{ idx, item } of effectIndex" :for="`${idPrefix}-${item.id.split('.').slice(-1)[0]}`" class="cursor-pointer block"
            :class="{ 'checkbox-disabled': shouldDisabled(item.id) }" :key="idx">
            <input type="checkbox" :id="`${idPrefix}-${item.id.split('.').slice(-1)[0]}`" :disabled="shouldDisabled(item.id)" :value="item.id"
                v-model="model.selectedString" class="hidden">
            <div class="flex items-start">
                <div class="checkbox flex-shrink-0"></div>
                <div class="break-all">{{ item.name ? item.name : item.id }}</div>
            </div>
            <div class="description pl-6 text-gray-400" v-html="renderMD(item.description)">
            </div>
        </label>
        <div v-for="{ idx, item } of selectionIndex" :key="idx">
            <div class="flex items-start">
                <div class="checkbox" :class="{ checked: isSelected(model.selectedSelection[idx]) }"></div>
                <EffectSelection :idPrefix="idPrefix" v-model="model.selectedSelection[idx]" :effect="item"
                    :disabled="shouldDisabled(model.selectedSelection[idx])"></EffectSelection>
            </div>
        </div>
        <div v-for="{ idx, item } of groupIndex" :key="idx">
            <div class="flex items-start">
                <div class="checkbox" :class="{ checked: isSelected(model.selectedGroup[idx]) }"></div>
                <EffectGroup :idPrefix="idPrefix" v-model="model.selectedGroup[idx]" :effects="item"
                    :disabled="shouldDisabled(model.selectedGroup[idx])" :inSelection="true"></EffectGroup>
            </div>
        </div>
    </div>
</template>
<style scoped>
.checkbox {
    @apply w-4 h-4 rounded-sm border border-slate-50 relative mr-2 mt-1;
}

.warning {
    @apply text-yellow-400;
}

.checked::after,
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

.disabled {
    @apply text-gray-400;
}
</style>