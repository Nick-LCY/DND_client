import { ref } from "vue"
import { Character } from "./template"

const characterResult = ref(new Character())

function reset(what: "character") {
    switch (what) {
        case "character":
            characterResult.value = new Character()
            break
    }
}

export { characterResult, reset }
