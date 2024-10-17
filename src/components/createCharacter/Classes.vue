<script setup lang="ts">
import { ref, computed } from 'vue';
import { getById } from '../../api/getById';
import { updateCategories } from '../../assets/js/generateCategories';

let classes_data = [{ id: "_dnd5e:babarian", name: "野蛮人" }]

const classes = ref(classes_data)
const emit = defineEmits(["change"])
const description = ref<string>("")
const classSelection = ref<{ id: string, level: number, subclass: string }>({ id: "", level: 1, subclass: "" })
const choosenClass = computed(() => classSelection.value.id != "")
const subclassAvailable = computed(() => classSelection.value.level >= subclassAvailableLevel.value)
const subclassAvailableLevel = ref(20)
const subclasses = ref<Array<{id: string, name: string}>>([])

async function changeClass(classId: string) {
    let classData = await getById(classId);
    subclassAvailableLevel.value = classData.subclasses_available_level
    subclasses.value = classData.subclasses
    let { categories, description: descriptionHTML } = updateCategories(classData)
    description.value = descriptionHTML
    emit("change", categories)
}

function levelDown() {
    classSelection.value.level = Math.max(1, classSelection.value.level - 1)
}
function levelUp() {
    classSelection.value.level++
}
</script>
<template>
    <div>
        <h2 class="font-bold text-center text-3xl mt-8 mb-4 flex-shrink-0">选择职业</h2>
        <div class="h-48 mx-8 scroll-xs flex items-stretch flex-shrink-0">
            <div class="w-1/2 flex-grow flex flex-col transition-all" :class="{ 'mr-2': subclassAvailable }">
                <span class="font-bold text-xl text-center mb-2 transition-all overflow-hidden h-0"
                    :class="{ 'h-7': subclassAvailable }">主职业</span>
                <div class="overflow-y-auto bg-slate-700 rounded-lg scroll-xs flex flex-col items-stretch flex-grow">
                    <label class="option" v-for="class_obj in classes" :for="class_obj.id" :key="class_obj.id">
                        <input type="radio" class="hidden" name="class" :id="class_obj.id" :value="class_obj.id"
                            v-model="classSelection.id" @change="changeClass(class_obj.id)">
                        <div class="option-circle"></div>
                        {{ class_obj.name }}
                    </label>
                </div>
            </div>
            <div class="w-0 flex flex-col overflow-hidden transition-all"
                :class="{ 'ml-2': subclassAvailable, '!w-1/2': subclassAvailable }">
                <span class="font-bold text-xl text-center mb-2 overflow-hidden h-0"
                    :class="{ 'h-7': subclassAvailable }">子职业</span>
                <div class="overflow-y-auto bg-slate-700 rounded-lg scroll-xs flex flex-col items-stretch flex-grow">
                    <label class="option" v-for="subclass_obj in subclasses" :for="subclass_obj.id" :key="subclass_obj.id">
                        <input type="radio" class="hidden" name="subclass" :id="subclass_obj.id" :value="subclass_obj.id"
                            v-model="classSelection.subclass">
                        <div class="option-circle"></div>
                        {{ subclass_obj.name }}
                    </label>
                </div>
            </div>
        </div>
        <div class="mx-8 mt-4 shrink-0 flex justify-between items-center h-0 overflow-hidden transition-all"
            :class="{ 'show': choosenClass }">
            <span class="text-xl font-bold shrink-0">等级：</span>
            <div class="flex justify-between items-center">
                <button
                    class="w-8 h-8 flex justify-center items-center border-2 rounded-md border-transparent transition hover:border-slate-500"
                    @click="levelDown">
                    <div class="w-4 h-0.5 bg-slate-50"></div>
                </button>
                <span class="mx-2 font-bold text-xl">{{ classSelection.level }}</span>
                <button
                    class="w-8 h-8 flex justify-center items-center border-2 rounded-md border-transparent transition hover:border-slate-500"
                    @click="levelUp">
                    <div class="relative">
                        <div class="w-4 h-0.5 bg-slate-50"></div>
                        <div class="absolute top-0 left-0 w-4 h-0.5 bg-slate-50 rotate-90"></div>
                    </div>
                </button>
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

.show {
    @apply h-8
}
</style>