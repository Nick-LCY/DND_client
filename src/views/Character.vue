<script setup>
import { ref, computed } from 'vue';

const spellLevels = ref(["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ"])
const abilities = ref(["力", "敏", "体", "智", "感", "魅"])
const remainingHP = ref(0)
const fullHP = ref(100)
const HPBarStyleRight = computed(() => { return `${100 - remainingHP.value / fullHP.value * 100}%` })

</script>
<template>
    <main class="bg-slate-600 h-screen flex justify-start items-start">
        <div id="main-status">
            <div id="abilities-container"
                class="w-16 bg-gray-700 flex flex-col justify-around items-stretch cursor-default select-none">
                <div v-for="i in abilities" class="text-center text-slate-50 py-2 border-b border-b-slate-50 mx-1">
                    <div>{{ i }}</div>
                    <div class="font-bold text-xl">15</div>
                </div>
            </div>
            <div id="profile" class="bg-slate-300 relative overflow-hidden">
                <img src="/src/assets/图片1.png" id="profile-pic" class="w-full h-full bg-slate-700 object-contain">
                <div id="info">
                    <div class="name-container">
                        <span class="key">角色名字：</span>
                        <span class="value">阿卡列</span>
                    </div>
                    <div class="name-container">
                        <span class="key">玩家名字：</span>
                        <span class="value">盒子</span>
                    </div>
                </div>
            </div>
            <div id="spell-slots-container"
                class="w-16 flex flex-col justify-start items-stretch bg-gray-800 cursor-default select-none overflow-auto">
                <div v-for="i in spellLevels" class="text-center text-slate-50 py-2 border-b border-b-slate-50 mx-1">
                    <div class="text-xs leading-3">{{ i }}</div>
                    <div>🔷×5</div>
                </div>
            </div>
            <div id="hp-container"
                class="h-8 bg-red-900 text-center font-bold text-slate-50 leading-8 relative overflow-hidden">
                <div class="w-full h-full absolute top-0 bg-red-500" :style="{ right: HPBarStyleRight }"></div>
                <span class="relative"> {{ remainingHP }} / {{ fullHP }} </span>
            </div>
        </div>
        <div id="skills"></div>
        <div id="equipments"></div>
        <div id="package"></div>
        <div id="spells"></div>
    </main>
</template>
<style scoped>
#main-status {
    display: grid;
    grid-template-areas:
        ". . ."
        "a a a";
}

#hp-container {
    grid-area: a;
}

#abilities-container,
#spell-slots-container {
    height: 32rem;
}

#abilities-container>div:last-child,
#spell-slots-container>div:last-child {
    @apply border-b-0;
}


#profile {
    height: 32rem;
    width: 18rem;
}

#info {
    @apply flex flex-col items-stretch justify-center;
    @apply absolute left-0 -bottom-10;
    @apply w-full h-20 px-8 bg-slate-900/80;
    @apply transition-all hover:bottom-0;
}

.name-container {
    @apply flex justify-between text-slate-200 leading-10;
}

.name-container>.key {
    @apply select-none;
}

.name-container>.value {
    @apply select-all cursor-pointer;
    @apply hover:font-bold;
}

#spell-slots-container::-webkit-scrollbar {
    width: 3px;
}

#spell-slots-container::-webkit-scrollbar-track {
    background-color: transparent;
}

#spell-slots-container::-webkit-scrollbar-thumb {
    @apply bg-gray-400;
    border-radius: 1px;
}
</style>