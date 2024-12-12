import { SourcedExpression, SourceRepresentation } from "./dataType"
import { processExpression } from "./processExpression"
import { store } from "../store"
interface Stack {
    [key: string]: SourcedExpression[] | Stack
}
interface Source {
    [key: string]: SourceRepresentation[] | Source
}


class Character {
    private stack: Stack = {}
    private source: Source = {}
    abilities = {
        str: 8, dex: 8, con: 8,
        int: 8, wis: 8, cha: 8,
    }
    saves = {
        str: false, dex: false, con: false,
        int: false, wis: false, cha: false,
    }
    skills = {
        acrobatics: 0, animal_handling: 0, arcana: 0, athletics: 0,
        deception: 0, history: 0, insight: 0, intimidation: 0,
        investigation: 0, medicine: 0, nature: 0, perception: 0,
        performance: 0, persuasion: 0, religion: 0, sleight_of_hand: 0,
        stealth: 0, survival: 0,
    }
    class = {
        level: 0, main: "", sub: ""
    }
    race = {
        main: "", sub: ""
    }
    background = ""
    spell_slots = {
        1: { current: 0, capacity: 0 },
        2: { current: 0, capacity: 0 },
        3: { current: 0, capacity: 0 },
        4: { current: 0, capacity: 0 },
        5: { current: 0, capacity: 0 },
        6: { current: 0, capacity: 0 },
        7: { current: 0, capacity: 0 },
        8: { current: 0, capacity: 0 },
        9: { current: 0, capacity: 0 },
    }
    languages = []
    hit_dice = 0
    speed = 0
    hp = 0
    initiate = 0
    proficiencies = []

    public addEffect(target: string, expression: SourcedExpression) {
        let hierarchy = target.split(".").slice(1)
        let targetStack: any = this.stack
        function findTarget(keys: string[]) {
            if (targetStack[keys[0]] === undefined) {
                if (keys.length === 1) targetStack[keys[0]] = []
                else targetStack[keys[0]] = {}
            }
            targetStack = targetStack[keys[0]]
            if (keys.length > 1) findTarget(keys.slice(1))
        }
        findTarget(hierarchy);
        (targetStack as SourcedExpression[]).push(expression)
    }

    public getSource(key: string): SourceRepresentation[] {
        let that: any = this.source
        for (let part of key.split(".")) {
            if (that === undefined || that[part] === undefined) return []
            that = that[part]
        }
        return that as SourceRepresentation[]
    }

    public compute() {
        function forEach(expStack: Stack, expSource: Source, processedKeys: string[] = []) {
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
        store.characterEffects.class.forEach(v => v(this))
        store.characterEffects.spell_slots.forEach(v => v(this))
        store.characterEffects.abilities.forEach(v => v(this))
        store.characterEffects.race.forEach(v => v(this))
        store.characterEffects.background.forEach(v => v(this))
        // 2. 属性点、技能效果计算
        forEach(this.stack, this.source,
            ["abilities", "saves", "skills", "languages", "hit_dice", "speed", "proficiencies"])
        // 3. 属性点间接决定属性计算（如先攻）
        this.initiate = Math.floor(this.abilities.dex / 2) - 5
        let hd = this.hit_dice
        let conMod = Math.floor(this.abilities.con / 2) - 5
        this.hp = hd + conMod + (this.class.level - 1) * (hd / 2 + 1 + conMod)
        // 4. 属性点间接决定属性效果计算
        forEach(this.stack, this.source, ["initiate", "hp"])
    }
}

export { Character }