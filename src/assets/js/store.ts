import { reactive } from "vue";
import { ExpressionResult } from "./expression/dataType";

const keys = ["class", "race", "background", "spell_slots", "abilities"] as const
type characterEffectKeys = (typeof keys)[number]

export const store = reactive({
    loading: false,
    startLoad() {
        this.loading = true
    },
    endLoad() {
        this.loading = false
    },
    characterEffects: {
        class: [],
        race: [],
        background: [],
        spell_slots: [],
        abilities: []
    } as Record<characterEffectKeys, ((v: ExpressionResult) => void)[]>,
    addCharacterEffect(field: characterEffectKeys, fn: (v: ExpressionResult) => void) {
        this.characterEffects[field].push(fn)
    },
    clearCharacterEffect(field: characterEffectKeys) {
        this.characterEffects[field].splice(0)
    }
})