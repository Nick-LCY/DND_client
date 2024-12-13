<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { nameMapping, skillCategoryMapping, skillNameMapping } from '../assets/js/mappings';
import { characterResult } from '../assets/js/expression/expressionResults';
import { getById } from '../assets/js/api/getById';
import { formatNumber } from '../assets/js/expression/utils';
import { AbilityKeys } from '../assets/js/expression/dataType';

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
    return "布什"
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
                    <section class="flex flex-col">
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
                        <h2>特性</h2>
                    </section>
                </div>
            </div>
            <div class="page" :style="{ 'transform': pageTransform }">
                <div>
                    <section class="combat">
                        <h2>战斗属性</h2>
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
    @apply col-span-2;
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

.abilities-table {
    @apply flex-grow flex-shrink text-center;
}

thead {
    @apply border-b-2;
}

tr {
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
</style>