interface Value {
    type: ("number" | "string" | "boolean")
    value: string
}
interface Expression {
    type?: ("number" | "string" | "void" | "boolean")
    target: string
    operation: ("+" | "+=" | "-" | "-=" | "=" | "==" | "<=" | ">=" | ">" | "<" | "push")
    values: (
        Expression |
        boolean |
        number |
        string |
        Value)[]
}
interface Effect {
    type: "effect"
    id: string
    name: string
    description: string
    expressions: Expression[],
    prerequisite?: Expression
}

interface Spell {
    id: string
    name: string
    description: string
    spell_level: number
}

interface SpellList {
    id: string
    name: string
    description: string
    list: Spell[]
}

interface SpellListEffect {
    id: string
    type: "spell_list_effect"
    name: string
    description: string
    spells: {
        known?: number
        start_level?: number
        end_level?: number
        level?: number
        cantrip_only?: boolean
        spell_only?: boolean
        from: (SpellList | Spell)[] | SpellList
    }[]
}

interface EffectGroup extends Array<Effect | EffectGroup | EffectSelection | SpellListEffect> {
    [key: number]: Effect | EffectGroup | EffectSelection | SpellListEffect
}

interface EffectGroupDict {
    type: "group_dict"
    name: string
    description: string
    group: EffectGroup
}

interface EffectSelection {
    type: "selection"
    choose: number | string
    available: EffectGroup
    name?: string
    description?: string
    allow_repeat?: boolean
}

interface Feature {
    id: string
    name: string
    description: string
    category: string
    effects: EffectGroup | EffectGroupDict
}

interface Subrace {
    id: string
    name: string
    description: string
    features: Feature[]
    remove_features?: Feature[]
}

interface Race {
    id: string
    name: string
    description: string
    features: Feature[]
    subraces: Subrace[]
}

interface LeveledFeature {
    start_level: number
    end_level?: number,
    feature: Feature
}

interface Subclass {
    id: string
    name: string
    description: string
    features: Feature[]
    leveled_features: LeveledFeature[]
}

interface SpellSlot {
    spell_level: number
    class_level: number[]
    capacity: number[]
}

interface Class {
    id: string
    name: string
    description: string
    features: Feature[]
    leveled_features: LeveledFeature[]
    subclass_name: string
    subclasses_available_level: number
    subclasses: Subclass[]
    spell_slots?: SpellSlot[]
}

interface Background {
    id: string
    name: string
    description: string
    features: Feature[]
}

function isSpellListEffect(obj: Effect
    | EffectSelection
    | EffectGroup
    | EffectGroupDict
    | SpellListEffect
): obj is SpellListEffect {
    return (<SpellListEffect>obj).type === "spell_list_effect"
}

function isEffect(obj: Effect
    | EffectSelection
    | EffectGroup
    | EffectGroupDict
    | SpellListEffect
): obj is Effect {
    return (<Effect>obj).type === "effect"
}

function isEffectGroup(obj: Effect
    | EffectSelection
    | EffectGroup
    | EffectGroupDict
    | SpellListEffect
): obj is EffectGroup {
    return obj instanceof Array
}

function isEffectGroupDict(obj: Effect
    | EffectSelection
    | EffectGroup
    | EffectGroupDict
    | SpellListEffect
): obj is EffectGroupDict {
    return (<EffectGroupDict>obj).type === "group_dict"
}

function isEffectGroupOrEffectGroupDict(obj: Effect
    | EffectSelection
    | EffectGroup
    | EffectGroupDict
    | SpellListEffect
): obj is (EffectGroupDict | EffectGroup) {
    return !isEffect(obj) && !isEffectSelection(obj) && !isSpellListEffect(obj)
}

function isEffectSelection(obj: Effect
    | EffectSelection
    | EffectGroup
    | EffectGroupDict
    | SpellListEffect
): obj is EffectSelection {
    return (<EffectSelection>obj).type === "selection"
}

function isExpression(obj: any): obj is Expression {
    return (<Expression>obj).target !== undefined
}

function isValue(obj: any): obj is Value {
    return (<Value>obj).value !== undefined
}

function isSpell(obj: Spell | SpellList): obj is Spell {
    return (<SpellList>obj).list === undefined
}

function isSpellList(obj: Spell | SpellList): obj is SpellList {
    return (<SpellList>obj).list !== undefined
}

export {
    isEffect,
    isSpellListEffect,
    isEffectSelection,
    isEffectGroup,
    isEffectGroupDict,
    isEffectGroupOrEffectGroupDict,
    isExpression,
    isValue,
    isSpell,
    isSpellList
}

export type {
    Race,
    Subrace,
    Feature,
    LeveledFeature,
    EffectSelection,
    EffectGroup,
    EffectGroupDict,
    Spell,
    SpellList,
    SpellListEffect,
    Effect,
    Expression,
    SpellSlot,
    Class,
    Subclass,
    Background
}

