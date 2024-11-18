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
    characterEffects: [] as ((v: ExpressionResult) => void)[],
    addCharacterEffect(fn: (v: ExpressionResult) => void) {
        this.characterEffects.push(fn)
    },
    clearEffect() {
        this.characterEffects.splice(0)
    }
})