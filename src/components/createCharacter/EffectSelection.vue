<script lang="ts" setup>
import { computed } from 'vue';
import type {
    EffectSelection as EffectSelectionType,
    Effect as EffectType,
    EffectGroup as EffectGroupType,
    EffectGroupDict as EffectGroupDictType,
} from '../../assets/js/originalDataType';
import { isEffect, isEffectSelection, isEffectGroupOrEffectGroupDict } from '../../assets/js/originalDataType';
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
    () => filterByType<EffectGroupType | EffectGroupDictType>(
        props.effect.available, isEffectGroupOrEffectGroupDict
    )
)
const effectIndex = computed(
    () => filterByType<EffectType>(props.effect.available, isEffect)
)
const isFull = computed(() => selectedCount(model.value) >= Number(props.effect.choose))
function shouldDisabled(selection: vModelSelection | string): boolean {
    if (props.disabled) return true
    if (isFull.value) {
        if (typeof selection === "string") {
            for (let selectedEffect of model.value.selectedString) {
                if (selectedEffect.id === selection && selectedEffect.value > 0)
                    return false
            }
            return true
        } else {
            if (!isSelected(selection)) return true
        }
    }
    return false
}

function selectionAdd(idx: number) {
    model.value.selectedString[idx].value += 1
}

function selectionMinus(idx: number) {
    model.value.selectedString[idx].value = Math.max(
        0, model.value.selectedString[idx].value - 1
    )
}
</script>
<template>
    <div>
        <div class="font-bold text-green-500"
            :class="{ warning: selectedCount(model) < Number(effect.choose), disabled }">
            [{{ selectedCount(model) }} / {{ effect.choose }}]
        </div>
        <template v-for="{ idx, item } of effectIndex">
            <label v-if="!effect.allow_repeat" :for="`${idPrefix}-${idx}`"
                class="flex flex-col items-start cursor-pointer" :class="{ 'disabled': shouldDisabled(item.id) }"
                :key="idx">
                <input type="checkbox" :id="`${idPrefix}-${idx}`" :disabled="shouldDisabled(item.id)" :value="1"
                    v-model="model.selectedString[idx].value" class="hidden" v-if="!effect.allow_repeat">
                <div class="flex items-start">
                    <div class="checkbox flex-shrink-0" :class="{ checked: model.selectedString[idx].value > 0 }"></div>
                    <div class="break-all">{{ item.name ? item.name : item.id }}</div>
                </div>
                <div class="description pl-6 text-gray-400" v-html="renderMD(item.description)">
                </div>
            </label>
            <div v-else class="flex items-start gap-2">
                <div class="flex items-center justify-center gap-1">
                    <button
                        class="w-5 h-5 flex justify-center items-center border rounded-sm border-transparent transition hover:border-slate-500"
                        @click="selectionMinus(idx)" :disabled="shouldDisabled(item.id)">
                        <div class="w-2 h-0.5 bg-slate-50"></div>
                    </button>
                    {{ model.selectedString[idx].value }}
                    <button
                        class="w-5 h-5 flex justify-center items-center border rounded-sm border-transparent transition hover:border-slate-500"
                        @click="selectionAdd(idx)"
                        :disabled="shouldDisabled(item.id) || model.selectedString[idx].value >= Number(effect.choose)">
                        <div class="relative">
                            <div class="w-2 h-0.5 bg-slate-50"></div>
                            <div class="absolute top-0 left-0 w-2 h-0.5 bg-slate-50 rotate-90"></div>
                        </div>
                    </button>
                </div>
                <div>
                    <div class="break-all">{{ item.name ? item.name : item.id }}</div>
                    <div class="description text-gray-400" v-html="renderMD(item.description)">
                    </div>
                </div>
            </div>
        </template>
        <div v-for="{ idx, item } of selectionIndex" :key="idx">
            <div class="flex items-start">
                <div class="checkbox" :class="{ checked: isSelected(model.selectedSelection[idx]) }"></div>
                <EffectSelection :idPrefix="`${idPrefix}-${idx}`" v-model="model.selectedSelection[idx]" :effect="item"
                    :disabled="shouldDisabled(model.selectedSelection[idx])"></EffectSelection>
            </div>
        </div>
        <div v-for="{ idx, item } of groupIndex" :key="idx">
            <div class="flex items-start">
                <div class="checkbox" :class="{ checked: isSelected(model.selectedGroup[idx]) }"></div>
                <EffectGroup :idPrefix="`${idPrefix}-${idx}`" v-model="model.selectedGroup[idx]" :effects="item"
                    :disabled="shouldDisabled(model.selectedGroup[idx])" :inSelection="true"></EffectGroup>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url("../../assets/css/selection.css");
</style>