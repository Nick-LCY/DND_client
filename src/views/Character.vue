<script setup lang="ts">
import { computed, ref } from 'vue';

// function abilityExpandScroll(event: Event) {
//     const dom = event.currentTarget as HTMLElement
//     const wheelEvent = event as WheelEvent
//     dom.scrollLeft += wheelEvent.deltaY
// }
const currentPage = ref(1)
const pageTransform = computed(() =>
    `translateX(${(1 - currentPage.value) * 100}%)`
)
</script>
<template>
    <div class="character-container">
        <div class="character-control" :class="{ 'page-rp': currentPage === 1, 'page-combat': currentPage === 2 }">
            <button @click="currentPage = 1">RP页面</button>
            <button @click="currentPage = 2">战斗页面</button>
        </div>
        <div class="character-content">
            <div class="page" :style="{ 'transform': pageTransform }">
                <div class="rp-page">
                    <section class="character-info">
                        <h2>角色资料</h2>
                        <div class="item">
                            <label for="char-name">角色名字</label>
                            <input type="text" id="char-name" class="value to-fill-value">
                        </div>
                        <div class="item">
                            <label for="player-name">玩家名字</label>
                            <input type="text" id="player-name" class="value to-fill-value">
                        </div>
                        <div class="group">
                            <div class="item">
                                <label for="height">身高</label>
                                <input type="text" id="height" class="value to-fill-value">
                            </div>
                            <div class="item">
                                <label for="weight">体重</label>
                                <input type="text" id="weight" class="value to-fill-value">
                            </div>
                        </div>
                        <div class="group">
                            <div class="item">
                                <label for="gender">性别</label>
                                <input type="text" id="gender" class="value to-fill-value">
                            </div>
                            <div class="item">
                                <label for="age">年龄</label>
                                <input type="text" id="age" class="value to-fill-value">
                            </div>
                        </div>
                        <div class="group">
                            <div class="item">
                                <label for="faith">信仰</label>
                                <input type="text" id="faith" class="value to-fill-value">
                            </div>
                            <div class="item">
                                <label for="camp">阵营</label>
                                <input type="text" id="camp" class="value to-fill-value">
                            </div>
                        </div>
                        <div class="group">
                            <div class="item">
                                <div>种族</div>
                                <div class="value gen-value">矮人</div>
                            </div>
                            <div class="item">
                                <div>亚种</div>
                                <div class="value gen-value">山地矮人</div>
                            </div>
                        </div>
                        <div class="group">
                            <div class="item">
                                <div>背景</div>
                                <div class="value gen-value">士兵</div>
                            </div>
                            <div class="item">
                                <div>体型</div>
                                <div class="value gen-value">中型</div>
                            </div>
                        </div>
                    </section>
                    <section class="background-traits">
                        <h2>背景特质</h2>
                        <div class="item">
                            <label for="personality">特点</label>
                            <textarea rows="1" class="value-area filled-value scroll-xs" name=""
                                id="personality"></textarea>
                        </div>
                        <div class="item">
                            <label for="ideal">理想</label>
                            <textarea rows="1" class="value-area filled-value scroll-xs" name="" id="ideal"></textarea>
                        </div>
                        <div class="item">
                            <label for="bond">牵绊</label>
                            <textarea rows="1" class="value-area filled-value scroll-xs" name="" id="bond"></textarea>
                        </div>
                        <div class="item">
                            <label for="flaw">缺点</label>
                            <textarea rows="1" class="value-area filled-value scroll-xs" name="" id="flaw"></textarea>
                        </div>
                        <div class="item">
                            <label for="others">其他</label>
                            <textarea rows="1" class="value-area filled-value scroll-xs" name="" id="others"></textarea>
                        </div>
                    </section>
                    <section class="flex flex-col items-stretch col-span-2">
                        <h2 class="mb-1">
                            <label for="story">背景故事</label>
                        </h2>
                        <textarea class="value-area scroll-xs to-fill-value" name="" id="story"></textarea>
                    </section>
                </div>
            </div>
            <div class="page" :style="{ 'transform': pageTransform }">
                <section class="abilities">能力</section>
                <section class="skills">技能与熟练项</section>
                <section class="traits">特性</section>
            </div>
            <div class="page" :style="{ 'transform': pageTransform }">
                <section class="combat">战斗</section>
                <section class="actions">动作</section>
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
    @apply border-2 border-slate-600 flex items-stretch gap-4 rounded-full overflow-hidden relative h-8;
}

.character-control::after {
    content: "";
    @apply absolute h-full w-20 bg-slate-700 -z-10 rounded-full transition-all;
}

.character-control.page-rp::after {
    @apply left-0;
}

.character-control.page-combat::after {
    @apply left-24;
}

.character-control button {
    @apply w-20;
}

.character-content {
    @apply overflow-hidden flex items-stretch flex-grow flex-shrink w-full;
}

.page {
    @apply w-1/2 flex-shrink-0 pr-4 transition;
}

.rp-page {
    @apply grid gap-2 h-full w-full;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: minmax(0, 2fr) 3fr;
}

section {
    @apply rounded-md border-2 border-slate-600 p-2;
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
</style>