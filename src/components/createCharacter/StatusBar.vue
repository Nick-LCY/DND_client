<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { AbilityKeys, SkillKeys, SourcedEffect } from '../../assets/js/expression/dataType';
import { shortNameMapping, nameMapping, skillNameMapping } from '../../assets/js/mappings';
import { store } from '../../assets/js/store';
import { characterResult } from '../../assets/js/expression/expressionResults';
import { updateCharacter } from '../../assets/js/expression/update';

const props = defineProps<{ activatedEffects: SourcedEffect[] }>()

interface sourceRepresentation {
    sources: string[]
    result: string
}

watch(() => props.activatedEffects, updateCharacter)
const skillCategory: Record<AbilityKeys, SkillKeys[]> = {
    str: ["athletics"],
    dex: ["acrobatics", "sleight_of_hand", "stealth"],
    con: [],
    int: ["arcana", "history", "investigation", "religion", "nature"],
    wis: ["animal_handling", "insight", "medicine", "survival", "perception"],
    cha: ["deception", "intimidation", "performance", "persuasion"]
}

const popoutHidden = ref(true)
const sections = computed(() => {
    const localSections: { [key: string]: { name: string, content: sourceRepresentation[] }[] } = {
        str: [], dex: [], con: [],
        wis: [], int: [], cha: [],
    }
    for (let ability of Object.keys(localSections)) {
        const abilityValueSource = characterResult.value.getSource(`abilities.${ability}`).slice()
        const abilitySaveSource = characterResult.value.getSource(`saves.${ability}`).slice()
        localSections[ability].push({ "name": "数值", content: abilityValueSource })
        localSections[ability].push({ "name": "豁免熟练项", content: abilitySaveSource })
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

const statusPannelOpen = ref(false)
</script>
<template>
    <div class="status-container" :class="{ open: statusPannelOpen }">
        <div class="status-bar">
            <div class="relative z-20 px-1 bg-slate-700">
                <div class="text-center font-bold text-lg py-1">属性</div>
                <div v-for="(displayName, abilityName) of shortNameMapping"
                    class="text-center flex justify-center border-t border-slate-50 py-1 last:border-b">
                    <button
                        class="flex flex-col items-center cursor-pointer select-none w-full hover:bg-slate-500 rounded-sm transition-colors py-1 gap-1"
                        @click="openPopout(abilityName)">
                        <div class="relative" :class="{ 'save-proficiency': characterResult.saves[abilityName] }">
                            {{ displayName }}
                        </div>
                        <span class="text-xl">{{ characterResult.abilities[abilityName] }}</span>
                    </button>
                </div>
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
        <div class="status-pannel">
            <div class="font-bold text-center text-lg border-b py-1">技能</div>
            <div v-for="value, categoryKey of skillCategory" :key="categoryKey"
                class="flex flex-col items-stretch flex-grow basis-1">
                <div class="skill-container">
                    <div v-for="skillKey of value" :key="skillKey" class="basis-1/3 flex-shrink-0">
                        {{ skillNameMapping[skillKey] }}
                        ×{{ characterResult.skills[skillKey] }}
                    </div>
                </div>
            </div>
        </div>
        <div class="px-1 py-2 text-center text-lg flex flex-col justify-center">
            <div class="font-bold">HP</div>
            <div class="text-xl mb-3">{{ Number(characterResult.hp) > 0 ? characterResult.hp : "未知" }}</div>
            <div class="font-bold">先攻</div>
            <div class="text-xl mb-3">
                {{ Number(characterResult.initiate) > 0 ? `+${characterResult.initiate}` : characterResult.initiate }}
            </div>
            <div class="font-bold">速度</div>
            <div class="text-xl">{{ Number(characterResult.speed) <= 0 ? "未知" : characterResult.speed }}</div>
            </div>
            <div class="details scroll-xs">
                <div class="text-lg font-bold my-1 py-1 text-center border-b flex-shrink-0">法术点</div>
                <div class="spell-slots-display">
                    <template v-for="spellSlot, spellLevel in characterResult.spell_slots">
                        <div class="w-1/3 text-center h-8 leading-8" v-if="spellSlot.capacity !== 0">
                            {{ `${spellLevel}环：${spellSlot.capacity}🔷` }}
                        </div>
                    </template>
                    <div class="nothing">无法术点</div>
                </div>
                <div class="text-lg font-bold my-1 py-1 text-center border-b flex-shrink-0">语言</div>
                <div class="languages-display">
                    <div v-for="language of new Set(characterResult.languages)" class="w-1/4 text-center h-8 leading-8">
                        {{ language }}
                    </div>
                    <div class="nothing">未掌握语言</div>
                </div>
                <div class="text-lg font-bold my-1 py-1 text-center border-b flex-shrink-0">熟练项</div>
                <div class="proficiencies-display flex-grow h-20">
                    <div v-for="language of new Set(characterResult.proficiencies)"
                        class="w-1/4 text-center h-8 leading-8">
                        {{ language }}
                    </div>
                    <div class="nothing">无熟练项</div>
                </div>
            </div>
            <div class="flex flex-col items-stretch pb-2 gap-2 px-1">
                <button @click="statusPannelOpen = !statusPannelOpen" class="button">
                    {{ statusPannelOpen ? "折叠" : "展开" }}
                </button>
                <button class="button">设置</button>
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

.button {
    @apply py-2 font-bold border-2 rounded-md border-slate-500;
    @apply flex items-center justify-center;
    @apply transition hover:bg-slate-500;
    @apply select-none cursor-pointer;
}

.status-container {
    @apply bg-slate-700 grid;
    grid-template-columns: 50px 300px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        ". ."
        ". a"
        ". a";
    transition: width 150ms ease;
    width: 50px;
}

.details {
    grid-area: a;
    @apply px-1 flex flex-col overflow-auto;
}

.open {
    width: 350px;
}

.status-bar {
    @apply relative flex-shrink-0;
    width: 50px;
}

.open>.status-bar>div {
    @apply pr-0;
}

.status-pannel {
    @apply relative z-20 w-full bg-slate-700 pr-1 flex-shrink-0 flex flex-col items-stretch;
    width: 300px;
}

.skill-container {
    @apply border-b pl-4 py-1 flex flex-wrap gap-y-1 items-center flex-grow;
}

.save-proficiency::after {
    content: "";
    @apply w-6 h-full border absolute -left-1 bottom-0 rounded-sm;
}

.languages-display,
.proficiencies-display,
.spell-slots-display {
    @apply flex flex-wrap mt-2 items-start;
}

.spell-slots-display {
    @apply h-24;
}

.languages-display {
    @apply h-16;
}

.nothing {
    @apply w-full justify-center hidden h-full items-center;
}

.spell-slots-display>div:first-child.nothing,
.proficiencies-display>div:first-child.nothing,
.languages-display>div:first-child.nothing {
    display: flex;
}
</style>