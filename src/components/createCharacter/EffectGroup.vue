<script lang="ts" setup>
import { computed } from 'vue';
import type {
    EffectGroupDict as EffectGroupDictType,
    EffectGroup as EffectGroupType,
    EffectSelection as EffectSelectionType,
    Effect as EffectType
} from '../../assets/js/originalDataType';
import { isEffectGroup, isEffectSelection, isEffect, isEffectGroupOrEffectGroupDict } from '../../assets/js/originalDataType';
import { renderMD } from '../../assets/js/renderMarkdown';
import type { vModelSelection } from '../../assets/js/selections';
import { filterByType, isSelected, selectedCount } from '../../assets/js/selections';
import EffectSelection from './EffectSelection.vue';

const props = withDefaults(
    defineProps<{
        effects: EffectGroupType | EffectGroupDictType,
        idPrefix: string,
        disabled?: boolean,
        inSelection?: boolean
    }>(),
    { disabled: false, inSelection: false }
)
const selectionIndex = computed(
    () => filterByType<EffectSelectionType>(props.effects, isEffectSelection)
)
const groupIndex = computed(
    () => filterByType<EffectGroupType | EffectGroupDictType>(
        props.effects, isEffectGroupOrEffectGroupDict
    )
)
const effectIndex = computed(
    () => filterByType<EffectType>(props.effects, isEffect)
)

const groupLength = computed(
    () => isEffectGroup(props.effects) ? props.effects.length : props.effects.group.length
)
const model = defineModel<vModelSelection>({ required: true })
function addGroupToSelected() {
    if (props.disabled) return
    if (model.value.selectedString.length === 0) {
        model.value.selectedString.push(...effectIndex.value.map(
            x => { return { id: x.item.id, value: 1 } })
        )
    } else {
        model.value.selectedString.splice(0, model.value.selectedString.length)
    }
}
</script>
<template>
    <div>
        <div v-if="inSelection" class="font-bold text-green-500"
            :class="{ warning: selectedCount(model) < groupLength, disabled: disabled }">
            [{{ selectedCount(model) }} / {{ groupLength }}]
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
                <EffectSelection :idPrefix="`${idPrefix}-${idx}`" :disabled="disabled"
                    v-model="model.selectedSelection[idx]" :effect="item">
                </EffectSelection>
            </div>
        </div>
        <div v-for="{ idx, item } of groupIndex" :key="idx">
            <div class="flex items-start">
                <div class="checkbox" v-if="inSelection" :class="{ checked: isSelected(model.selectedGroup[idx]) }">
                </div>
                <EffectGroup :idPrefix="`${idPrefix}-${idx}`" :disabled="disabled" v-model="model.selectedGroup[idx]"
                    :effects="item" :inSelection="inSelection">
                </EffectGroup>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url("../../assets/css/selection.css");
</style>