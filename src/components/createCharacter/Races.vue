<script setup lang="ts">
import { ref } from 'vue';
import { getById } from '../../api/getById';
import races_data from "../../api/races.json";
import { processFeatures } from '../../assets/js/featureProcessing';
import { renderMD } from '../../assets/js/renderMarkdown';
const races = ref(races_data)
const emit = defineEmits(["change"])
const description = ref<string>("")
const subraces = ref<Array<{ id: string, name: string }>>([{ id: "none", name: "无" }])
const raceSelection = ref<{ race: string, subrace: string }>({ race: "", subrace: "none" })

async function changeRace() {
    let raceData = await getById(raceSelection.value.race);
    raceSelection.value.subrace = "none"
    subraces.value = [{id: "none", name: "无"}, ...raceData.subraces]
    let categories = processFeatures(raceData.features)
    description.value = renderMD(raceData.description)
    emit("change", categories)
}

async function changeSubrace() {
    let raceData = await getById(raceSelection.value.race);
    let subraceId = raceSelection.value.subrace
    if (subraceId === "none") {
        changeRace()
        return
    }
    let features = raceData.features
    for (let subrace of raceData.subraces) {
        if (subrace.id === subraceId) {
            features = [...features, ...subrace.features]
            break
        }
    }
    let categories = processFeatures(features)
    emit("change", categories)
}
</script>
<template>
    <div>
        <h2 class="font-bold text-center text-3xl mt-8 mb-4 flex-shrink-0">选择种族</h2>
        <div class="h-48 mx-8 flex items-stretch gap-4 flex-shrink-0">
            <div class="flex flex-col items-stretch flex-grow basis-1">
                <span class="font-bold text-xl text-center mb-2 transition-all overflow-hidden flex-shrink-0">主种族</span>
                <div class="overflow-y-auto bg-slate-700 rounded-lg scroll-xs flex flex-col items-stretch flex-grow">
                    <label class="option" v-for="race in races" :for="race.id" :key="race.id">
                        <input type="radio" class="hidden" name="race" :value="race.id" :id="race.id"
                            v-model="raceSelection.race" @change="changeRace">
                        <div class="option-circle"></div>
                        {{ race.name }}
                    </label>
                </div>
            </div>
            <div class="flex flex-col items-stretch flex-grow basis-1">
                <span class="font-bold text-xl text-center mb-2 transition-all overflow-hidden flex-shrink-0">亚种</span>
                <div class="overflow-y-auto bg-slate-700 rounded-lg scroll-xs flex flex-col items-stretch flex-grow">
                    <label class="option" v-for="subrace in subraces" :for="subrace.id" :key="subrace.id">
                        <input type="radio" class="hidden" name="subrace" :value="subrace.id" :id="subrace.id"
                            v-model="raceSelection.subrace" @change="changeSubrace">
                        <div class="option-circle"></div>
                        {{ subrace.name }}
                    </label>
                </div>
            </div>
        </div>
        <div class="description scroll-xs" v-html="description"></div>
    </div>
</template>
<style scoped>
.option {
    @apply p-4 text-lg bg-slate-700 flex items-center transition-colors cursor-pointer border-b-4 border-slate-800;
    @apply hover:bg-slate-800;
}

.option-circle {
    @apply w-6 h-6 mr-4 rounded-full bg-slate-800 border-2 border-slate-700 relative;
}

.option:hover>.option-circle {
    @apply border-slate-500
}

input[type="radio"]:checked+.option-circle::after {
    content: " ";
    @apply w-3 h-3 rounded-full bg-slate-300 absolute top-1 left-1;
}

.description {
    @apply m-8 p-2 bg-slate-800 overflow-auto rounded-lg h-64 flex-grow;
}
</style>