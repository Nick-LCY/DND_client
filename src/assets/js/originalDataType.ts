interface Expression {
    target: string
    operation: ("+" | "+=" | "-" | "-=" | "=")
    values: (
        Expression |
        boolean |
        number |
        string)[]
}
interface Effect {
    id: string
    name: string
    description: string
    expressions: Expression[]
}

interface EffectGroup extends Array<Effect | EffectGroup | EffectSelection> {
    [key: number]: Effect | EffectGroup | EffectSelection
}

interface EffectGroupDict {
    type: "group_dict"
    name: string
    description: string
    group: EffectGroup
}

interface EffectSelection {
    type: "selection"
    choose: number
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
interface Class {
    id: string
    name: string
    description: string
    features: Feature[]
    leveled_features: LeveledFeature[]
    subclass_name: string
    subclasses_available_level: number
    subclasses: Subclass[]
}

function isEffect(obj: Effect
    | EffectSelection
    | EffectGroup
    | EffectGroupDict
): obj is Effect {
    return !isEffectGroup(obj) && !isEffectSelection(obj) && !isEffectGroupDict(obj);
}

function isEffectGroup(obj: Effect
    | EffectSelection
    | EffectGroup
    | EffectGroupDict
): obj is EffectGroup {
    return obj instanceof Array
}

function isEffectGroupDict(obj: Effect
    | EffectSelection
    | EffectGroup
    | EffectGroupDict
): obj is EffectGroupDict {
    return (<EffectGroupDict>obj).type === "group_dict"
}

function isEffectGroupOrEffectGroupDict(obj: Effect
    | EffectSelection
    | EffectGroup
    | EffectGroupDict
): obj is (EffectGroupDict | EffectGroup) {
    return !isEffect(obj) && !isEffectSelection(obj)
}

function isEffectSelection(obj: Effect
    | EffectSelection
    | EffectGroup
    | EffectGroupDict
): obj is EffectSelection {
    return (<EffectSelection>obj).type === "selection"
}

export {
    isEffect,
    isEffectSelection,
    isEffectGroup,
    isEffectGroupDict,
    isEffectGroupOrEffectGroupDict,
}

export type {
    Race,
    Subrace,
    Feature,
    LeveledFeature,
    EffectSelection,
    EffectGroup,
    EffectGroupDict,
    Effect,
    Expression,
    Class,
    Subclass
}

