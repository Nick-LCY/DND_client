import { SourcedEffect } from './dataType';
import { isEffect } from '../originalDataType';
import { spellList } from './spellLists';
import { characterResult, reset } from './expressionResults';
function updateCharacter(v: SourcedEffect[]) {
    reset("character")
    spellList.value.splice(0)
    // Push
    for (let sourcedEffect of v) {
        if (isEffect(sourcedEffect.effect)) {
            for (let expression of sourcedEffect.effect.expressions) {
                const { target } = expression
                let target_obj = target.split(".")[0]
                switch (target_obj) {
                    case "character":
                        characterResult.value.addEffect(target, {
                            sources: sourcedEffect.sources,
                            expression
                        })
                }
            }
        } else {
            spellList.value.push({ sources: sourcedEffect.sources, effect: sourcedEffect.effect })
        }
    }
    characterResult.value.compute()
}

export {
    updateCharacter
}