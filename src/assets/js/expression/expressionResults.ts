import { ref } from "vue"
import { character } from "./template"
import { deepReset } from "./utils"
import { ExpressionResult } from "./dataType"

const characterResult = ref<ExpressionResult>(deepReset<ExpressionResult>(character, {}))

function reset(what: "character") {
    switch (what) {
        case "character":
            deepReset(character, characterResult.value)
            break
    }
}

export { characterResult, reset }
