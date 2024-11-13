import { ref } from "vue"
import { ExpressionSource } from "./dataType"

const characterSource = ref<ExpressionSource>({
    abilities: { str: [], dex: [], con: [], wis: [], int: [], cha: [] },
    saves: { str: [], dex: [], con: [], wis: [], int: [], cha: [] },
})

function reset(what: "character") {
    function _reset(obj: ExpressionSource) {
        Object.values(obj).forEach((v) => {
            if (v instanceof Array) v.splice(0)
            else _reset(v)
        })
    }

    switch (what) {
        case "character":
            _reset(characterSource.value)
            break
    }
}

export { characterSource, reset }