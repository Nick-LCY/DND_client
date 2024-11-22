import { ref } from "vue"
import { ExpressionStack, SourcedExpression } from "./dataType"

const characterStack = ref<ExpressionStack>({
    abilities: { str: [], dex: [], con: [], wis: [], int: [], cha: [] },
    saves: { str: [], dex: [], con: [], wis: [], int: [], cha: [] },
    skills: {
        acrobatics: [], animal_handling: [], arcana: [], athletics: [],
        deception: [], history: [], insight: [], intimidation: [],
        investigation: [], medicine: [], nature: [], perception: [],
        performance: [], persuasion: [], religion: [], sleight_of_hand: [],
        stealth: [], survival: [],
    },
    class: {
        level: [], main: [], sub: []
    },
    spell_slots: {
        1: {current: [], capacity: []},
        2: {current: [], capacity: []},
        3: {current: [], capacity: []},
        4: {current: [], capacity: []},
        5: {current: [], capacity: []},
        6: {current: [], capacity: []},
        7: {current: [], capacity: []},
        8: {current: [], capacity: []},
        9: {current: [], capacity: []},
    },
    languages: [],
    hit_dice: [],
    speed: [],
    initiate: [],
    hp: [],
    proficiencies: [],
})

function reset(what: "character") {
    function _reset(obj: ExpressionStack) {
        Object.values(obj).forEach((v) => {
            if (v instanceof Array) v.splice(0)
            else _reset(v)
        })
    }

    switch (what) {
        case "character":
            _reset(characterStack.value)
            break
    }
}

function forEach(obj: ExpressionStack, operation: (v: SourcedExpression) => undefined) {
    Object.values(obj).forEach(v => {
        if (v instanceof Array) v.forEach(operation)
        else forEach(v, operation)
    })
}
export { characterStack, reset, forEach }