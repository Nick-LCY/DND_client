import { reactive } from "vue";
import { ExpressionResult } from "./expression/dataType";

export const store = reactive({
    loading: false,
    startLoad() {
        this.loading = true
    },
    endLoad() {
        this.loading = false
    },
    characterEffects: {
        class: [] as ((v: ExpressionResult) => void)[]
    },
    addCharacterEffect(field: "class", fn: (v: ExpressionResult) => void) {
        this.characterEffects[field].push(fn)
    },
    clearCharacterEffect(field: "class") {
        this.characterEffects[field].splice(0)
    }
})