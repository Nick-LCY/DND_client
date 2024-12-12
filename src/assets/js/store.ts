import { reactive } from "vue";
import { Character } from "./expression/template";

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
    } as Record<characterEffectKeys, ((v: Character) => void)[]>,
    addCharacterEffect(field: characterEffectKeys, fn: (v: Character) => void) {
        this.characterEffects[field].push(fn)
    },
    clearCharacterEffect(field: characterEffectKeys) {
        this.characterEffects[field].splice(0)
    }
})