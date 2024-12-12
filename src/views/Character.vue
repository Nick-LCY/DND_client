<script setup lang="ts">
import { computed, ref } from 'vue';
import { nameMapping } from '../assets/js/mappings';
import { characterResult } from '../assets/js/expression/expressionResults';

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
                                <div class="value gen-value">{{ characterResult.race.main || '未知' }}</div>
                            </div>
                            <div class="item">
                                <div>亚种</div>
                                <div class="value gen-value">{{ characterResult.race.sub || '未知' }}</div>
                            </div>
                        </div>
                        <div class="group">
                            <div class="item">
                                <div>背景</div>
                                <div class="value gen-value">{{ characterResult.background || '未知' }}</div>
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
                            <label for="story">背景故事</label>
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
                        <h2 class="mb-2">属性</h2>
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
                                    <td class="bg-slate-800">{{ Math.floor(characterResult.abilities[key] / 2 - 5) }}
                                    </td>
                                    <td class="bg-slate-800">{{ Math.floor(characterResult.abilities[key] / 2 - 5) +
                                        (characterResult.saves[key] ? proficiencyBonus : 0) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section class="skills">
                        <h2>技能与熟练项</h2>
                        <div>熟练项加值： {{ proficiencyBonus }}</div>
                        <div>技能</div>
                        <div></div>
                        <div>熟练项</div>
                        <div></div>
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
</style>