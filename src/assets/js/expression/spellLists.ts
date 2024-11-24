import { ref } from "vue";
import { SpellListEffect } from "../originalDataType";

interface SourcedSpellListEffect {
    sources: string[]
    effect: SpellListEffect
}
const spellList = ref<SourcedSpellListEffect[]>([])

export { spellList }