<script setup lang="ts">
import { ref } from 'vue';
import { getById } from '../../api/getById';
import { updateCategories } from '../../assets/js/generateCategories';

let classes_data = [{ id: "_dnd5e:babarian", name: "野蛮人" }]

const classes = ref(classes_data)
const emit = defineEmits(["change"])
const description = ref<string>("")

async function changeClass(classId: string) {
    let classData = await getById(classId);
    let { categories, description: descriptionHTML } = updateCategories(classData)
    description.value = descriptionHTML
    emit("change", categories)
}
</script>
<template>
    <div>
        <h2 class="font-bold text-center text-3xl my-8 flex-shrink-0">选择职业</h2>
        <div
            class="h-48 overflow-y-auto bg-slate-700 mx-8 rounded-lg scroll-xs flex flex-col items-stretch flex-shrink-0">
            <label class="option" v-for="class_obj in classes" :for="class_obj.id" :key="class_obj.id">
                <input type="radio" class="hidden" name="class" :id="class_obj.id" :value="class_obj.id"
                    @change="changeClass(class_obj.id)">
                <div class="option-circle"></div>
                {{ class_obj.name }}
            </label>
        </div>
        <div class="description scroll-xs" v-html="description"></div>
        <div class="mx-8 flex items-stretch h-10 shrink-0 gap-2 mb-8">
            <button class="leading-10 w-10 rounded-md bg-red-500 transition hover:bg-red-700">X</button>
            <button
                class="leading-10 flex-grow rounded-md bg-green-600 font-bold text-lg transition hover:bg-green-800">继续</button>
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

input[name="class"]:checked+.option-circle::after {
    content: " ";
    @apply w-3 h-3 rounded-full bg-slate-300 absolute top-1 left-1;
}

.description {
    @apply m-8 p-2 bg-slate-800 overflow-auto rounded-lg h-64 flex-grow;
}
</style>