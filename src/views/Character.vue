<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { nameMapping, skillCategoryMapping, skillNameMapping } from '../assets/js/mappings';
import { characterResult } from '../assets/js/expression/expressionResults';
import { getById } from '../assets/js/api/getById';
import { formatNumber } from '../assets/js/expression/utils';
import { AbilityKeys } from '../assets/js/expression/dataType';
import { Effect, isEffect, SpellListEffect } from '../assets/js/originalDataType';

interface Result {
    name: string
    description: string
    sources: string[]
    effects: (Effect | SpellListEffect)[]
}

const props = defineProps<{ features: Result[] }>()

// function abilityExpandScroll(event: Event) {
//     const dom = event.currentTarget as HTMLElement
//     const wheelEvent = event as WheelEvent
//     dom.scrollLeft += wheelEvent.deltaY
// }
const currentPage = ref(1)
const pageTransform = computed(() =>
    `translateX(${(1 - currentPage.value) * 100}%)`
)
const proficiencyBonus = computed(() => Math.ceil(characterResult.value.class.level / 4) + 1)
const abilityModValues = computed(() => {
    const result: Record<AbilityKeys, number> = {
        str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0
    }
    for (let [key, val] of Object.entries(characterResult.value.abilities)) {
        result[key as AbilityKeys] = Math.floor(val / 2 - 5)
    }
    return result
})
const abilitySaveValues = computed(() => {
    const result: Record<AbilityKeys, number> = {
        str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0
    }
    for (let [key, val] of Object.entries(characterResult.value.abilities)) {
        result[key as AbilityKeys] = Math.floor(val / 2 - 5)
        if (characterResult.value.saves[key as AbilityKeys])
            result[key as AbilityKeys] += proficiencyBonus.value
    }
    return result
})
const characterData = ref({
    playerName: "",
    characterName: "",
    height: "",
    weight: "",
    gender: "",
    age: "",
    faith: "",
    align: "",
    bgPersonality: "",
    bgIdeal: "",
    bgBond: "",
    bgFlaw: "",
    bgOther: "",
    backgroundStory: "",
})

// TODO: 这里好蠢，之后看看怎么改
// ==============================================================
async function tryToGet(id: string): Promise<string> {
    if (id === "none") return "无"
    if (id) return ((await getById(id)) as any).name as string
    return "未知"
}

const computedCharacterData = ref({
    mainRace: "未知",
    subRace: "未知",
    mainClass: "未知",
    subClass: "未知",
    background: "未知"
})

watch(characterResult, async () => {
    computedCharacterData.value.mainRace = await tryToGet(characterResult.value.race.main)
    computedCharacterData.value.subRace = await tryToGet(characterResult.value.race.sub)
    computedCharacterData.value.mainClass = await tryToGet(characterResult.value.class.main)
    computedCharacterData.value.subClass = await tryToGet(characterResult.value.class.sub)
    computedCharacterData.value.background = await tryToGet(characterResult.value.background)
})
// ==============================================================

const selectedFeature = ref(-1)
const currentDescription = computed(() => {
    if (selectedFeature.value === -1) return ""
    return props.features[selectedFeature.value].description
})
const currentEffects = computed(() => {
    if (selectedFeature.value === -1) return []
    return props.features[selectedFeature.value].effects.filter(isEffect)
})
</script>
<template>
    <div class="character-container">
        <div class="character-control" :class="{ 'page-rp': currentPage === 1, 'page-combat': currentPage === 2 }">
            <button @click="currentPage = 1">RP页面</button>
            <button @click="currentPage = 2">战斗页面</button>
        </div>
        <div class="character-content">
            <div class="page" :style="{ 'transform': pageTransform }">
                <div>
                    <section class="character-info">
                        <h2>角色资料</h2>
                        <div class="item">
                            <label for="char-name">角色名字</label>
                            <input type="text" id="char-name" class="value"
                                :class="[!characterData.characterName ? 'to-fill-value' : 'filled-value']"
                                v-model="characterData.characterName">
                        </div>
                        <div class="item">
                            <label for="player-name">玩家名字</label>
                            <input type="text" id="player-name" class="value"
                                :class="[!characterData.playerName ? 'to-fill-value' : 'filled-value']"
                                v-model="characterData.playerName">
                        </div>
                        <div class="group">
                            <div class="item">
                                <label for="height">身高</label>
                                <input type="text" id="height" class="value"
                                    :class="[!characterData.height ? 'to-fill-value' : 'filled-value']"
                                    v-model="characterData.height">
                            </div>
                            <div class="item">
                                <label for="weight">体重</label>
                                <input type="text" id="weight" class="value"
                                    :class="[!characterData.weight ? 'to-fill-value' : 'filled-value']"
                                    v-model="characterData.weight">
                            </div>
                        </div>
                        <div class="group">
                            <div class="item">
                                <label for="gender">性别</label>
                                <input type="text" id="gender" class="value"
                                    :class="[!characterData.gender ? 'to-fill-value' : 'filled-value']"
                                    v-model="characterData.gender">
                            </div>
                            <div class="item">
                                <label for="age">年龄</label>
                                <input type="text" id="age" class="value"
                                    :class="[!characterData.age ? 'to-fill-value' : 'filled-value']"
                                    v-model="characterData.age">
                            </div>
                        </div>
                        <div class="group">
                            <div class="item">
                                <label for="faith">信仰</label>
                                <input type="text" id="faith" class="value"
                                    :class="[!characterData.faith ? 'to-fill-value' : 'filled-value']"
                                    v-model="characterData.faith">
                            </div>
                            <div class="item">
                                <label for="align">阵营</label>
                                <input type="text" id="align" class="value"
                                    :class="[!characterData.align ? 'to-fill-value' : 'filled-value']"
                                    v-model="characterData.align">
                            </div>
                        </div>
                        <div class="group">
                            <div class="item">
                                <div>种族</div>
                                <div class="value gen-value">{{ computedCharacterData.mainRace }}</div>
                            </div>
                            <div class="item">
                                <div>亚种</div>
                                <div class="value gen-value">{{ computedCharacterData.subRace }}</div>
                            </div>
                        </div>
                        <div class="group">
                            <div class="item">
                                <div>背景</div>
                                <div class="value gen-value">{{ computedCharacterData.background }}</div>
                            </div>
                            <div class="item">
                                <div>体型</div>
                                <div class="value gen-value">{{ characterResult.size || '未知' }}</div>
                            </div>
                        </div>
                    </section>
                    <section class="background-traits">
                        <h2>背景特质</h2>
                        <div class="item">
                            <label for="personality">特点</label>
                            <textarea rows="1" class="value-area scroll-xs"
                                :class="[!characterData.bgPersonality ? 'to-fill-value' : 'filled-value']"
                                id="personality" v-model="characterData.bgPersonality"></textarea>
                        </div>
                        <div class="item">
                            <label for="ideal">理想</label>
                            <textarea rows="1" class="value-area scroll-xs"
                                :class="[!characterData.bgIdeal ? 'to-fill-value' : 'filled-value']" id="ideal"
                                v-model="characterData.bgIdeal"></textarea>
                        </div>
                        <div class="item">
                            <label for="bond">牵绊</label>
                            <textarea rows="1" class="value-area scroll-xs"
                                :class="[!characterData.bgBond ? 'to-fill-value' : 'filled-value']" id="bond"
                                v-model="characterData.bgBond"></textarea>
                        </div>
                        <div class="item">
                            <label for="flaw">缺点</label>
                            <textarea rows="1" class="value-area scroll-xs"
                                :class="[!characterData.bgFlaw ? 'to-fill-value' : 'filled-value']" id="flaw"
                                v-model="characterData.bgFlaw"></textarea>
                        </div>
                        <div class="item">
                            <label for="others">其他</label>
                            <textarea rows="1" class="value-area scroll-xs"
                                :class="[!characterData.bgOther ? 'to-fill-value' : 'filled-value']" id="others"
                                v-model="characterData.bgOther"></textarea>
                        </div>
                    </section>
                    <section class="flex flex-col items-stretch col-span-2">
                        <h2 class="mb-2">
                            <label for="story">背景故事与描述</label>
                        </h2>
                        <textarea class="value-area scroll-xs"
                            :class="[!characterData.backgroundStory ? 'to-fill-value' : 'filled-value']" id="story"
                            v-model="characterData.backgroundStory"></textarea>
                    </section>
                </div>
            </div>
            <div class="page" :style="{ 'transform': pageTransform }">
                <div>
                    <section class="abilities">
                        <table class="abilities-table">
                            <thead>
                                <tr>
                                    <th>属性名</th>
                                    <th>属性值</th>
                                    <th>检定加值</th>
                                    <th>豁免加值</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="name, key of nameMapping">
                                    <td class="bg-slate-800">
                                        <div :class="{ 'has-proficiencies': characterResult.saves[key] }">
                                            {{ name }}
                                        </div>
                                    </td>
                                    <td class="bg-slate-800">
                                        {{ characterResult.abilities[key] }}
                                    </td>
                                    <td class="bg-slate-800">
                                        {{ formatNumber(abilityModValues[key]) }}
                                    </td>
                                    <td class="bg-slate-800">
                                        {{ formatNumber(abilitySaveValues[key]) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section class="skills">
                        <div class="col-span-3 border-b-2 border-slate-600">
                            <div class="font-bold text-center bg-slate-700 py-1">技能</div>
                            <div class="px-2 py-1">
                                <div class="w-1/4 text-center inline-block"
                                    v-for="val, skillName of characterResult.skills">
                                    <div class="inline-block w-1/2">
                                        {{ skillNameMapping[skillName] }}
                                    </div>
                                    <div class="w-1/2 text-left inline-block">
                                        {{ formatNumber(Math.floor(val * proficiencyBonus) +
                                            abilityModValues[skillCategoryMapping[skillName]]) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col border-r-2 border-slate-600 pb-2">
                            <div class="font-bold text-center bg-slate-700 py-1">语言</div>
                            <div class="scroll-xs overflow-auto h-20 flex-grow">
                                <div v-for="language of new Set(characterResult.languages)"
                                    class="text-center hover:bg-slate-600 transition-colors">
                                    {{ language }}
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col border-r-2 border-slate-600 pb-2">
                            <div class="font-bold text-center bg-slate-700 py-1">熟练项</div>
                            <div class="scroll-xs overflow-auto h-20 flex-grow ">
                                <div v-for="item of new Set(characterResult.proficiencies)"
                                    class="text-center hover:bg-slate-600 transition-colors">
                                    {{ item }}
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col border-slate-600">
                            <div class="font-bold text-center bg-slate-700 py-1">熟练加值</div>
                            <div class="flex-grow flex justify-center items-center text-3xl">
                                {{ formatNumber(proficiencyBonus) }}
                            </div>
                        </div>
                    </section>
                    <section class="traits">
                        <h2 class="my-2">特性</h2>
                        <div class="flex-grow h-10 flex gap-2 items-stretch justify-center pb-2">
                            <div class="scroll-xs h-full overflow-y-auto flex-grow basis-1 px-2">
                                <button v-for="feature, idx of props.features" :key="idx" class="feature-button"
                                    :class="{ 'bg-slate-700': idx === selectedFeature }" @click="selectedFeature = idx">
                                    <div>
                                        <div class="text-lg -mb-1">{{ feature.name }}</div>
                                        <div class="text-sm text-gray-400">{{ feature.sources.join(">") }}</div>
                                    </div>
                                    <div class="feature-arrow" :class="{ '!text-slate-50': idx === selectedFeature }"> >
                                    </div>
                                </button>
                            </div>
                            <div class="flex-grow basis-1 flex flex-col gap-2 pr-2">
                                <div
                                    class="flex-grow basis-1 flex-shrink flex flex-col rounded-md border-slate-600 border-2 overflow-hidden">
                                    <div class="text-center text-lg py-1 bg-slate-700">简介</div>
                                    <div v-html="currentDescription"
                                        class="h-10 flex-grow overflow-y-scroll scroll-xs description p-1"></div>
                                </div>
                                <div
                                    class="flex-grow basis-1 flex-shrink flex flex-col rounded-md border-slate-600 border-2 overflow-hidden">
                                    <div class="text-center text-lg py-1 bg-slate-700">已获得效果</div>
                                    <div class="h-10 flex-grow overflow-y-scroll scroll-xs p-1">
                                        <div v-for="effect of currentEffects"
                                            class="mb-1 border border-slate-600 rounded-md p-1">
                                            <div>{{ effect.name }}</div>
                                            <div class="text-sm text-gray-400">{{ effect.description }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <div class="page" :style="{ 'transform': pageTransform }">
                <div>
                    <section class="combat">
                        <div class="flex items-stretch overflow-hidden border-2 border-slate-600 rounded-md flex-wrap">
                            <div class="w-1/2 border-r-2 border-slate-600 flex flex-col border-b-2">
                                <div class="font-bold text-center bg-slate-700 py-1">生命值
                                </div>
                                <div class="my-auto text-center flex items-center justify-around text-xl">
                                    <input class="w-10 text-center py-1 rounded-sm bg-slate-600 outline-none"
                                        type="text">
                                    <span>/</span>
                                    <span>{{ characterResult.hp }}</span>
                                </div>
                            </div>
                            <div class="w-1/2 border-slate-600 flex flex-col border-b-2">
                                <div class="font-bold text-center bg-slate-700 py-1">临时生命值
                                </div>
                                <input
                                    class="my-auto text-xl py-1 text-center rounded-sm bg-slate-600 mx-2 outline-none"
                                    type="text">
                            </div>
                            <div class="w-1/2 border-r-2 border-slate-600 flex flex-col">
                                <div class="font-bold text-center bg-slate-700 py-1">AC
                                </div>
                                <div class="my-auto text-center text-xl">16</div>
                            </div>
                            <div class="w-1/2 flex-grow border-slate-600 flex flex-col">
                                <div class="font-bold text-center bg-slate-700 py-1">先攻
                                </div>
                                <div class="my-auto text-center text-xl">{{ formatNumber(characterResult.initiate) }}
                                </div>
                            </div>
                        </div>
                        <div class="border-2 border-slate-600 rounded-md flex flex-col">
                            <div class="text-center py-1 bg-slate-700 border-b-2 border-slate-600 font-bold">武器</div>
                            <div class="weapon-data">
                                <div class="row-span-2 bg-slate-700 border-r-2 border-b-2">主手</div>
                                <div class="border-r-2 border-b-2">命中</div>
                                <div class="border-b-2">5d4+1</div>
                                <div class="border-r-2 border-b-2">伤害</div>
                                <div class="border-b-2">5d4+1</div>
                                <div class="row-span-2 bg-slate-700 border-r-2">副手</div>
                                <div class="border-r-2 border-b-2">命中</div>
                                <div class="border-b-2">5d4+1</div>
                                <div class="border-r-2">伤害</div>
                                <div>5d4+1</div>
                            </div>
                        </div>
                        <div
                            class="text-center border-2 border-slate-600 rounded-md overflow-hidden flex flex-col row-span-2">
                            <div class="font-bold border-b-2 border-slate-600 bg-slate-700 py-1">施法</div>
                            <div class="flex-grow flex items-stretch">
                                <div class="flex flex-col items-stretch border-r-2 border-slate-600">
                                    <div class="flex-1 flex flex-col border-b-2 border-slate-600">
                                        <div class="py-1 bg-slate-700 px-2">豁免</div>
                                        <div class="flex-grow flex items-center justify-center text-xl">1</div>
                                    </div>
                                    <div class="flex-1 flex flex-col border-b-2 border-slate-600">
                                        <div class="py-1 bg-slate-700 px-2">命中</div>
                                        <div class="flex-grow flex items-center justify-center text-xl">+3</div>
                                    </div>
                                    <div class="flex-1 flex flex-col">
                                        <div class="py-1 bg-slate-700 px-2">属性</div>
                                        <div class="flex-grow flex items-center justify-center text-xl">魅</div>
                                    </div>
                                </div>
                                <div class="flex-grow flex flex-col gap-1 py-1">
                                    <template v-for="{ capacity }, spellLevel in characterResult.spell_slots"
                                        :key="spellLevel">
                                        <div v-if="capacity !== 0" class="flex items-center justify-between px-2">
                                            <div>{{ spellLevel }}环</div>
                                            <div class="flex items-center">
                                                <input
                                                    class="bg-slate-600 w-8 mr-2 h-6 outline-none text-center rounded-sm"
                                                    type="text"
                                                    v-model="characterResult.spell_slots[spellLevel].current">
                                                <span> / {{ capacity }} 🔷</span>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="border-2 border-slate-600 rounded-md flex flex-col">
                            <div class="flex font-bold">
                                <div class="flex-grow basis-1 py-1 bg-slate-700 text-center">职业</div>
                                <div class="flex-grow basis-1 py-1 bg-slate-700 text-center">子职业</div>
                                <div class="flex-grow basis-1 py-1 bg-slate-700 text-center">等级</div>
                            </div>
                            <div class="flex-grow scroll-xs overflow-y-auto">
                                <div class="flex border-slate-600 py-1 transition hover:bg-slate-600">
                                    <div class="flex-grow basis-1 text-center">{{
                                        computedCharacterData.mainClass }}
                                    </div>
                                    <div class="flex-grow basis-1 text-center">{{
                                        computedCharacterData.subClass }}
                                    </div>
                                    <div class="flex-grow basis-1 text-center">{{ characterResult.class.level }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="border-2 border-slate-600 rounded-md">
                            <div class="py-1 border-slate-600 bg-slate-700 text-center font-bold">
                                其他
                            </div>
                            速度、黑暗视觉、抗性……
                        </div>
                    </section>
                    <section class="actions">
                        <h2>背包、技能与法术</h2>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.character-container {
    @apply flex-shrink-0 w-full p-4 pr-0 bg-slate-800 h-screen text-slate-50;
    @apply gap-4 flex flex-col items-center;
}

.character-control {
    @apply border-2 border-slate-600 flex items-stretch gap-4 rounded-full overflow-hidden relative h-8 z-0;
}

.character-control::after {
    content: "";
    @apply absolute h-full w-32 bg-slate-700 -z-10 rounded-full transition-all;
}

.character-control.page-rp::after {
    @apply left-0;
}

.character-control.page-combat::after {
    @apply left-36;
}

.character-control button {
    @apply w-32;
}

.character-content {
    @apply overflow-hidden flex items-stretch flex-grow flex-shrink w-full;
}

.page {
    @apply w-1/2 flex-shrink-0 pr-4 transition;
}

.page>div {
    @apply grid gap-2 h-full w-full;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: minmax(0, 2fr) 3fr;
}

section {
    @apply rounded-md border-2 border-slate-600 p-2;
}

.traits,
.combat,
.actions {
    @apply col-span-2 overflow-hidden;
}

.combat {
    @apply grid p-0 border-0 gap-2;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 3fr 2fr;
}

.traits {
    @apply flex flex-col p-0;
}

.character-info {
    @apply flex items-stretch flex-col gap-2 justify-between;
}

.group {
    @apply flex justify-between gap-2 items-stretch;
}

.item {
    @apply flex gap-2 basis-1 items-center flex-shrink;
}

.group>.item {
    @apply flex-grow;
}

.background-traits>.item {
    @apply items-stretch flex-grow;
}

.background-traits {
    @apply flex flex-col gap-2;
}

.to-fill-value {
    @apply !border-b-yellow-500;
}

.filled-value {
    @apply !border-b-green-500;
}

.gen-value {
    @apply !border-b-slate-400;
}

.value {
    @apply bg-slate-600 px-1 flex-grow text-center border-y-2 border-transparent outline-none flex-shrink w-2;
}

.value-area {
    @apply bg-slate-600 outline-none text-left resize-none border-y-2 border-transparent;
    @apply flex-grow flex-shrink p-1;
}

h2 {
    @apply text-xl font-bold text-center;
}

.abilities {
    @apply p-0 overflow-hidden;
}

.abilities-table {
    @apply h-full w-full text-center;
}

thead {
    @apply bg-slate-700;
}

thead th {
    @apply py-1;
}

tbody td {
    @apply px-2;
}

thead tr {
    @apply border-b-0;
}

tr:not(:last-child) {
    @apply border-b border-slate-600;
}

.has-proficiencies {
    @apply border border-slate-400;
}

.skills {
    @apply grid p-0;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
}

.feature-button {
    @apply border-2 border-slate-600 rounded-md p-1 mb-2 w-full text-left;
    @apply cursor-pointer transition hover:bg-slate-700 flex items-center justify-between;
}

.feature-arrow {
    @apply text-2xl font-bold text-transparent transition mr-2;
}

.feature-button:hover .feature-arrow {
    @apply text-slate-50;
}

.weapon-data {
    @apply grid flex-grow;
    grid-template-columns: 3rem 3rem auto;
    grid-template-rows: repeat(4, 1fr);
}

.weapon-data>div {
    @apply border-slate-600 flex items-center justify-center;
}
</style>