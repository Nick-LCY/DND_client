<script lang="ts" setup>
import { computed } from 'vue';
import type {
    EffectGroup as EffectGroupType,
    EffectSelection as EffectSelectionType,
    Effect as EffectType
} from '../../assets/js/originalDataType';
import { isEffectGroup, isEffectSelection, isEffect } from '../../assets/js/originalDataType';
import { renderMD } from '../../assets/js/renderMarkdown';
import type { vModelSelection } from '../../assets/js/selections';
import { filterByType, isSelected, selectedCount } from '../../assets/js/selections';
import EffectSelection from './EffectSelection.vue';

const props = withDefaults(
    defineProps<{ effects: EffectGroupType, disabled?: boolean, inSelection?: boolean }>(),
    { disabled: false, inSelection: false }
)
const selectionIndex = computed(
    () => filterByType<EffectSelectionType>(props.effects, isEffectSelection)
)
const groupIndex = computed(
    () => filterByType<EffectGroupType>(props.effects, isEffectGroup)
)
const effectIndex = computed(
    () => filterByType<EffectType>(props.effects, isEffect)
)
const model = defineModel<vModelSelection>({ required: true })
function addGroupToSelected() {
    if (props.disabled) return
    if (model.value.selectedString.length === 0) {
        model.value.selectedString.push(...effectIndex.value.map(x => x.item.id))
    } else {
        model.value.selectedString.splice(0, model.value.selectedString.length)
    }
}
</script>
<template>
    <div>
        <div v-if="inSelection" class="font-bold text-green-500"
            :class="{ warning: selectedCount(model) < effects.length, disabled: disabled }">
            [{{ selectedCount(model) }} / {{ effects.length }}]
        </div>
        <button v-if="inSelection" @click="addGroupToSelected" class="flex flex-col">
            <div v-for="{ idx, item } of effectIndex" :key="idx" :class="{ 'checkbox-disabled': disabled }">
                <div class="break-all">{{ item.name ? item.name : item.id }}</div>
                <div class="description pl-6 text-slate-400" v-html="renderMD(item.description)">
                </div>
            </div>
        </button>
        <div v-for="{ idx, item } of selectionIndex" :key="idx">
            <div class="flex items-start">
                <div class="checkbox" v-if="inSelection" :class="{ checked: isSelected(model.selectedSelection[idx]) }">
                </div>
                <EffectSelection :disabled="disabled" v-model="model.selectedSelection[idx]" :effect="item">
                </EffectSelection>
            </div>
        </div>
        <div v-for="{ idx, item } of groupIndex" :key="idx">
            <div class="flex items-start">
                <div class="checkbox" v-if="inSelection" :class="{ checked: isSelected(model.selectedGroup[idx]) }">
                </div>
                <EffectGroup :disabled="disabled" v-model="model.selectedGroup[idx]" :effects="item"
                    :inSelection="inSelection">
                </EffectGroup>
            </div>
        </div>
    </div>
</template>
<style scoped>
.checkbox-disabled {
    @apply cursor-not-allowed text-gray-400;
}

.checkbox {
    @apply w-4 h-4 rounded-sm border border-slate-50 relative mr-2 mt-1;
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

.warning {
    @apply text-yellow-400;
}

.disabled {
    @apply text-gray-400;
}
</style>