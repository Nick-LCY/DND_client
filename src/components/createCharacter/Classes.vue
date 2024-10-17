<script setup lang="ts">
import { ref, computed } from 'vue';
import { getById } from '../../api/getById';
import { updateCategories } from '../../assets/js/generateCategories';

let classes_data = [{ id: "_dnd5e:babarian", name: "野蛮人" }]

const classes = ref(classes_data)
const emit = defineEmits(["change"])
const description = ref<string>("")
const classSelection = ref<{ id: string, level: number }>({ id: "", level: 1 })
const choosenClass = computed(() => classSelection.value.id != "")

async function changeClass(classId: string) {
    let classData = await getById(classId);
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
        <h2 class="font-bold text-center text-3xl my-8 flex-shrink-0">选择职业</h2>
        <div
            class="h-48 overflow-y-auto bg-slate-700 mx-8 rounded-lg scroll-xs flex flex-col items-stretch flex-shrink-0">
            <label class="option" v-for="class_obj in classes" :for="class_obj.id" :key="class_obj.id">
                <input type="radio" class="hidden" name="class" :id="class_obj.id" :value="class_obj.id"
                    v-model="classSelection.id" @change="changeClass(class_obj.id)">
                <div class="option-circle"></div>
                {{ class_obj.name }}
            </label>
        </div>
        <div class="mx-8 mt-4 shrink-0 flex justify-between items-center h-0 overflow-hidden transition-all" :class="{'show': choosenClass}">
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

input[name="class"]:checked+.option-circle::after {
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