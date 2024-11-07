<script setup lang="ts">
import { ref } from 'vue';
import { mergeCategories, processFeatures } from '../../assets/js/featureProcessing';
import { renderMD } from '../../assets/js/renderMarkdown';
import { getByDataType } from '../../assets/js/api/getByDataType';
import { getById } from '../../assets/js/api/getById';
import { Race } from '../../assets/js/originalDataType';
import { store } from '../../assets/js/store';

const races = ref<Array<Race>>([])
getByDataType<Race>("races").then(data => {
    races.value = data
})
const emit = defineEmits(["change"])
const subraces = ref<Array<{ id: string, name: string }>>([{ id: "none", name: "无" }])
const raceSelection = ref<{ race: string, subrace: string }>({ race: "", subrace: "none" })
const description = ref<{ race: string, subrace: string }>({ race: "", subrace: "" })
const currentDescription = ref<"race" | "subrace">("race")

async function changeRace() {
    store.startLoad()
    let raceData = await getById<Race>(raceSelection.value.race);
    raceSelection.value.subrace = "none"
    subraces.value = [{ id: "none", name: "无" }, ...raceData.subraces]
    let categories = processFeatures(raceData.features, ["种族", raceData.name])
    description.value.race = renderMD(raceData.description)
    emit("change", categories)
    store.endLoad()
}

async function changeSubrace() {
    store.startLoad()
    let raceData = await getById<Race>(raceSelection.value.race);
    let subraceId = raceSelection.value.subrace
    if (subraceId === "none") {
        changeRace()
        currentDescription.value = "race"
        return
    }
    let raceFeatures = raceData.features
    for (let subrace of raceData.subraces) {
        if (subrace.id === subraceId) {
            if (subrace.remove_features != undefined) {
                raceFeatures = raceFeatures.filter(feature => {
                    let needToRemove = false
                    subrace.remove_features?.forEach(v => {
                        if (v.id == feature.id) needToRemove = true
                    })
                    return !needToRemove
                })
            }
            let categories = mergeCategories(
                processFeatures(raceFeatures, ["种族", raceData.name]),
                processFeatures(
                    subrace.features,
                    ["种族", raceData.name, subrace.name]
                )
            )
            description.value.subrace = renderMD(subrace.description)
            emit("change", categories)
            store.endLoad()
            return
        }
    }
}

function changeCurrentDescription() {
    currentDescription.value = currentDescription.value === "race" ? "subrace" : "race"
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
        <div class="relative h-0">
            <div class="absolute w-20 h-10 right-10 top-10 overflow-hidden transition-transform"
                :class="{ 'scale-y-0': raceSelection.subrace == 'none' }">
                <button class="description-change-btn"
                    :class="{ 'scale-y-0': currentDescription !== 'race', 'z-10': currentDescription === 'race' }"
                    @click="changeCurrentDescription">
                    主种族
                </button>
                <button class="description-change-btn"
                    :class="{ 'scale-y-0': currentDescription !== 'subrace', 'z-10': currentDescription === 'subrace' }"
                    @click="changeCurrentDescription">
                    亚种
                </button>
            </div>
        </div>
        <div class="description scroll-xs" v-html="description[currentDescription]" :class="{ loading: store.loading }">
        </div>
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

.description-change-btn {
    @apply w-full h-full bg-slate-600 rounded-full absolute top-0 left-0 transition-transform;
}
</style>