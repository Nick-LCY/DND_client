import { findTarget } from './utils';
import { characterResult, reset as resultReset } from './expressionResults';
import { characterStack, reset as stackReset } from './expressionStacks';
import { characterSource, reset as sourceReset } from './expressionSource';
import { processExpression } from './processExpression';
import { ExpressionSource, ExpressionStack, SourcedEffect } from './dataType';
import { store } from '../store';
function updateCharacter(v: SourcedEffect[]) {
    // Clean
    resultReset("character")
    stackReset("character")
    sourceReset("character")
    // Push
    for (let sourcedEffect of v) {
        for (let expression of sourcedEffect.effect.expressions) {
            const { target } = expression
            let target_obj = target.split(".")[0]
            switch (target_obj) {
                case "character":
                    findTarget(target.split(".").slice(1).join("."), characterStack.value).push({
                        sources: sourcedEffect.sources,
                        expression
                    })
            }
        }
    }
    // Compute
    function forEach(expStack: ExpressionStack, expSource: ExpressionSource, processedKeys: string[] = []) {
        for (let [expStackKey, expStackVal] of Object.entries(expStack)) {
            if (processedKeys.length !== 0 && !processedKeys.includes(expStackKey)) continue
            if (expStackVal instanceof Array) {
                let expressionCategories: Record<string, (string | boolean | number)[]> = {
                    set: [], change: [], none: [], arrayPush: []
                }
                let target: Record<string, any>, targetKey: string
                expStackVal.forEach(i => {
                    let { expression, sources } = i
                    let values, modificationType
                    ({ values, target, key: targetKey, modificationType } = processExpression(expression))
                    expressionCategories[modificationType].push(values[0])
                    if (!(expSource[expStackKey] instanceof Array)) expSource[expStackKey] = []
                    let repr: string
                    switch (typeof values[0]) {
                        case "number":
                            repr = String(values[0])
                            if (values[0] > 0) repr = "+" + repr
                            break
                        case "boolean":
                            repr = ""
                            break
                        case "string":
                            repr = values[0]
                    }
                    expSource[expStackKey].push({ sources, result: repr })
                })
                if (expStackVal.length !== 0) {
                    if (expressionCategories.arrayPush.length !== 0) {
                        expressionCategories.arrayPush.forEach(v => target![targetKey!].push(v))
                    } else {
                        let finalValue = Math.max(
                            expressionCategories.change.reduce((p: number, c) => p + Number(c), 0),
                            expressionCategories.set.reduce((p: number, c) => Math.max(p, Number(c)), 0)
                        )
                        switch (typeof finalValue) {
                            case "number":
                                target![targetKey!] += finalValue
                                break
                            default:
                                target![targetKey!] = finalValue
                        }
                    }
                }

            } else {
                if (!expSource[expStackKey] || expSource[expStackKey] instanceof Array) expSource[expStackKey] = {}
                forEach(expStackVal, expSource[expStackKey])
            }
        }
    }
    // 1. 属性点（加点）、等级计算
    store.characterEffects.class.forEach(v => v(characterResult.value))
    store.characterEffects.spell_slots.forEach(v => v(characterResult.value))
    store.characterEffects.abilities.forEach(v => v(characterResult.value))
    // 2. 属性点、技能效果计算
    forEach(characterStack.value, characterSource.value,
        ["abilities", "saves", "skills", "languages", "hit_dice", "speed", "proficiencies"])
    // 3. 属性点间接决定属性计算（如先攻）
    characterResult.value.initiate = Math.floor((characterResult.value.abilities as { dex: number }).dex / 2) - 5
    let hd = Number(characterResult.value.hit_dice)
    let conMod = Math.floor((characterResult.value.abilities as { con: number }).con / 2) - 5
    characterResult.value.hp = hd + conMod + ((characterResult.value.class as { level: number }).level - 1) * (hd / 2 + 1 + conMod)
    // 4. 属性点间接决定属性效果计算
    forEach(characterStack.value, characterSource.value, ["initiate", "hp"])

}

export {
    updateCharacter
}