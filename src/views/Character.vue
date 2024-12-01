<script setup lang="ts">
// function abilityExpandScroll(event: Event) {
//     const dom = event.currentTarget as HTMLElement
//     const wheelEvent = event as WheelEvent
//     dom.scrollLeft += wheelEvent.deltaY
// }
</script>
<template>
    <div class="character-main">
        <section class="character-info">
            <h2>角色资料</h2>
            <div class="item !flex-grow-0">
                <label for="char-name">角色名字</label>
                <input type="text" id="char-name" class="value to-fill-value">
            </div>
            <div class="item !flex-grow-0">
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
            <div class="flex-grow flex flex-col items-stretch flex-shrink-1">
                <label class="mb-1" for="story">背景故事</label>
                <textarea class="value-area scroll-xs to-fill-value" name="" id="story"></textarea>
            </div>
        </section>
        <section class="abilities">能力</section>
        <section class="skills">技能</section>
        <section class="combat">战斗</section>
        <section class="background-traits flex flex-col gap-1">
            <h2>背景特质</h2>
            <label for="personality">特点</label>
            <textarea class="value-area filled-value flex-shrink flex-grow scroll-xs" name=""
                id="personality"></textarea>
            <label for="ideal">理想</label>
            <textarea class="value-area filled-value scroll-xs flex-grow flex-shrink" name="" id="ideal"></textarea>
            <label for="bond">牵绊</label>
            <textarea class="value-area filled-value scroll-xs flex-grow flex-shrink" name="" id="bond"></textarea>
            <label for="flaw">缺点</label>
            <textarea class="value-area filled-value scroll-xs flex-grow flex-shrink" name="" id="flaw"></textarea>
            <label for="others">其他</label>
            <textarea class="value-area filled-value scroll-xs flex-grow flex-shrink" name="" id="others"></textarea>
        </section>
        <section class="traits">特性</section>
        <section class="proficiencies">熟练项</section>
        <section class="actions">动作</section>
    </div>
</template>
<style scoped>
.character-main {
    @apply w-full flex-shrink-0 p-4 bg-slate-800 grid gap-2 h-screen overflow-hidden text-slate-50;
    grid-template-columns: repeat(4, minmax(0, auto));
    grid-template-rows: minmax(0, auto) minmax(0, auto);
}

section {
    @apply rounded-md border-2 border-slate-600 p-2;
}

.character-info {
    @apply flex items-stretch flex-col gap-2;
}

.group {
    @apply flex justify-between gap-2;
}

.item {
    @apply flex flex-grow gap-2 basis-1 items-center;
}

.character-info input {
    @apply outline-none flex-shrink w-2;
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
    @apply bg-slate-600 px-1 flex-grow text-center border-y-2 border-transparent;
}

.value-area {
    @apply flex-grow bg-slate-600 outline-none p-1 text-left resize-none w-full border-y-2 border-transparent;
}

h2 {
    @apply text-xl font-bold text-center;
}
</style>