<script setup lang="ts">
import { ref, computed } from 'vue';


let c = {
    name: "阿列克",
    username: "盒子",
    currentHP: 37,
    maxHP: 65,
    XP: 1052,
    nextLvlXP: 3000,
    lvl: 5,
}

let a = [
    {
        order: 0,
        name: "力",
        value: 15,
        sources: [
            { name: "基础值", value: 10 },
            { name: "谷歌手甲", link: "https://www.google.com", value: 5 }
        ]
    },
    {
        order: 1,
        name: "敏",
        value: 10,
        sources: [
            { name: "基础值", value: 10 },
        ]
    },
    {
        order: 2,
        name: "体",
        value: 10,
        sources: [
            { name: "基础值", value: 10 },
        ]
    },
    {
        order: 3,
        name: "智",
        value: 20,
        sources: [
            { name: "基础值", value: 10 },
            { name: "谷歌头环", link: "https://www.google.com", value: 5 },
            { name: "谷歌药水", link: "https://www.google.com", value: 3 },
            { name: "谷歌项链", link: "https://www.google.com", value: 2 },
        ]
    },
    {
        order: 4,
        name: "感",
        value: 10,
        sources: [
            { name: "基础值", value: 10 },
        ]
    },
    {
        order: 5,
        name: "魅",
        value: 10,
        sources: [
            { name: "基础值", value: 10 },
        ]
    }
]
let s = [
    { level: "Ⅰ", order: 0, available: 5, total: 5 }, { level: "Ⅱ", order: 1, available: 2, total: 2 }
]
const abilities = ref(a)
// const spellSlots = ref(["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ"])
const spellSlots = ref(s)
const character = ref(c)
const HPBarStyleRight = computed(() => { return `${100 - character.value.currentHP / character.value.maxHP * 100}%` })
const XPBarStyleRight = computed(() => { return `${100 - character.value.XP / character.value.nextLvlXP * 100}%` })

function abilityExpandScroll(event: Event) {
    const dom = event.currentTarget as HTMLElement
    const wheelEvent = event as WheelEvent
    dom.scrollLeft += wheelEvent.deltaY
}

</script>
<template>
    <main class="bg-slate-600 h-screen flex justify-start items-start">
        <div id="main-status">
            <div id="xp-container"
                class="h-6 bg-yellow-900 text-center font-bold text-slate-50 leading-6 relative overflow-hidden text-sm">
                <div class="w-full h-full absolute top-0 bg-yellow-500" :style="{ right: XPBarStyleRight }"></div>
                <div id="xp-level" class="relative transition-transform origin-bottom">{{ character.lvl }}级</div>
                <div id="xp-amount" class="relative transition-transform origin-top"> {{ character.XP }} / {{
                    character.nextLvlXP }} </div>
            </div>
            <div id="abilities-container"
                class="w-16 flex flex-col items-stretch cursor-default select-none bg-gray-800">
                <div v-for="ability in abilities"
                    class="ability-item-container text-center flex flex-col justify-center text-slate-50 py-2 border-b border-b-slate-50 relative flex-grow z-10">
                    <div class="ability-expand-container scroll-xs" @wheel.prevent="abilityExpandScroll">
                        <div class="text-2xl mx-1">=</div>
                        <div class="ability-source" v-for="source, idx in ability.sources" :key="idx">
                            <div class="inline-block transition-none">
                                <a v-if="source.link" :href="source.link" target="_blank" class="text-sm link block">{{
                                    source.name }}</a>
                                <div v-else class="text-sm">{{ source.name }}</div>
                                <div class="text-lg font-bold">{{ source.value }}</div>
                            </div>
                        </div>
                    </div>
                    <div>{{ ability.name }}</div>
                    <div class="font-bold text-xl">{{ ability.value }}</div>
                </div>
            </div>
            <div id="profile" class="bg-slate-300 relative overflow-hidden">
                <img src="/src/assets/图片1.png" id="profile-pic" class="w-full h-full bg-slate-700 object-contain">
                <div id="info">
                    <div class="name-container">
                        <span class="key">角色名字：</span>
                        <span class="value">{{ character.name }}</span>
                    </div>
                    <div class="name-container">
                        <span class="key">玩家名字：</span>
                        <span class="value">{{ character.username }}</span>
                    </div>
                </div>
            </div>
            <div id="spell-slots-container"
                class="w-16 flex flex-col justify-start items-stretch bg-gray-800 cursor-default select-none overflow-auto scroll-xs">
                <div v-for="slot in spellSlots" class="slot">
                    <div>{{ slot.level }}</div>
                    <div class="slot-fig">🔷×{{ slot.available }}</div>
                    <div class="slot-text">{{ slot.available }} / {{ slot.total }}</div>
                </div>
            </div>
            <div id="hp-container"
                class="h-8 bg-red-900 text-center font-bold text-slate-50 leading-8 relative overflow-hidden">
                <div class="w-full h-full absolute top-0 bg-red-500" :style="{ right: HPBarStyleRight }"></div>
                <span class="relative"> {{ character.currentHP }} / {{ character.maxHP }} </span>
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
        "a a a"
        ". . ."
        "b b b";
}

#xp-container {
    grid-area: a;
}

#xp-amount,
#xp-container:hover>#xp-level {
    @apply scale-y-0;
}

#xp-container:hover>#xp-level,
#xp-container:hover>#xp-amount {
    @apply -translate-y-6;
}

#xp-container:hover>#xp-amount,
#xp-level {
    @apply scale-y-100;
}

#hp-container {
    grid-area: b;
}

#abilities-container,
#spell-slots-container {
    height: 32rem;
}

#abilities-container>div:last-child,
#spell-slots-container>div:last-child {
    @apply border-b-0;
}

.ability-expand-container {
    @apply w-64 ml-16 bg-gray-800 absolute h-full top-0 rounded-r-md p-4 pl-0 overflow-auto;
    @apply scale-x-0 transition origin-left;
    @apply flex justify-start items-center;
    box-shadow: 6px 2px 6px rgb(0 0 0 / 0.1);
}

.ability-item-container:hover>.ability-expand-container {
    @apply scale-x-100;
}

.ability-source {
    @apply text-center flex-shrink-0;
}

.ability-source::after {
    content: "+";
    @apply text-2xl mx-1 inline-block;
}

.ability-source:last-child::after {
    content: "";
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

.slot {
    @apply text-center text-slate-50 py-2 border-b border-b-slate-50;
}

.slot:hover>.slot-text,
.slot-fig {
    @apply visible h-auto;
}

.slot:hover>.slot-fig,
.slot-text {
    @apply invisible h-0;
}
</style>