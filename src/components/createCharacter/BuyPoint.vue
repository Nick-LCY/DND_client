<script setup lang="ts">
import { AbilityKeys, SourcedEffect } from '../../assets/js/expression/dataType';
import { nameMapping } from '../../assets/js/mappings';
import { computed, ref, watch } from 'vue';
import { store } from '../../assets/js/store';
import { updateCharacter } from '../../assets/js/expression/update';
const props = defineProps<{ activatedEffects: SourcedEffect[] }>()
const baseAbilities = ref<Record<AbilityKeys, number>>({
    str: 8, dex: 8, con: 8,
    wis: 8, int: 8, cha: 8,
})
watch(baseAbilities.value, () =>
    updateAbilities()
)

function check(e: FocusEvent) {
    // TODO: AS
    let key = (e.target as HTMLInputElement).id
    baseAbilities.value[key as AbilityKeys] = Math.max(8, Math.min(baseAbilities.value[key as AbilityKeys], 20))
}

function increase(key: AbilityKeys) {
    baseAbilities.value[key] = Math.min(baseAbilities.value[key] + 1, 20)
}

function decrease(key: AbilityKeys) {
    baseAbilities.value[key] = Math.max(baseAbilities.value[key] - 1, 8)
}

function updateAbilities() {
    store.clearCharacterEffect("abilities")
    store.addCharacterEffect("abilities", (v) => {
        for (let [key, value] of Object.entries(baseAbilities.value)) {
            // TODO: AS
            (v.abilities as Record<string, number>)[key] = value
        }
    })
    updateCharacter(props.activatedEffects)
}
const cost = computed(() => {
    let cost = 0
    for (let num of Object.values(baseAbilities.value)) {
        cost += (num - 8) + (num >= 13 ? (num - 13) : 0)
    }
    return cost
})
</script>
<template>
    <div>
        <h2 class="font-bold text-center text-3xl my-8 flex-shrink-0">购点与法术</h2>
        <div class="font-bold text-center text-xl mb-4">基础属性值</div>
        <div class="buy-abilities">
            <template v-for="_, key of baseAbilities">
                <label :for="key" class="text-xl leading-10 h-10">{{ nameMapping[key] }}</label>
                <div class="flex items-center justify-center gap-x-4">
                    <button @click="decrease(key)">
                        <div class="w-4 h-1 bg-slate-50"></div>
                    </button>
                    <input :id="key" v-model.number="baseAbilities[key]" @blur="check">
                    <button @click="increase(key)">
                        <div class="relative">
                            <div class="w-4 h-1 bg-slate-50"></div>
                            <div class="absolute top-0 left-0 w-4 h-1 bg-slate-50 rotate-90"></div>
                        </div>
                    </button>
                </div>
            </template>
            <div class="text-xl font-bold flex items-center">
                购点消耗：
            </div>
            <div class="w-full text-xl font-bold flex items-center justify-center">{{ cost }}</div>
        </div>
    </div>
</template>
<style scoped>
.buy-abilities {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1.5fr;
    @apply mx-8 gap-y-4;
}

.buy-abilities input {
    @apply w-20 h-10 leading-10;
    @apply text-center font-bold;
    @apply rounded-md outline-none border-2;
    @apply bg-slate-800 border-slate-800;
    @apply transition;
}

.buy-abilities input:focus {
    @apply border-slate-50;
}

.buy-abilities button {
    @apply w-10 h-10 flex justify-center items-center border-2 rounded-md border-transparent transition hover:border-slate-500
}
</style>
