interface Effect {
    id: string
    name: string
    description: string
    expressions: string[]
}

interface EffectGroup extends Array<Effect | EffectGroup | EffectSelection> {
    [key: number]: Effect | EffectGroup | EffectSelection
}

interface EffectSelection {
    choose: number
    available: EffectGroup
}

interface Feature {
    id: string
    name: string
    description: string
    category: string
    effects: EffectGroup
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

function isEffect(obj: Effect | EffectSelection | EffectGroup): obj is Effect {
    return !isEffectGroup(obj) && !isEffectSelection(obj);
}

function isEffectGroup(obj: Effect | EffectSelection | EffectGroup): obj is EffectGroup {
    return obj instanceof Array
}

function isEffectSelection(obj: Effect | EffectSelection | EffectGroup): obj is EffectSelection {
    return !isEffectGroup(obj) && (<EffectSelection>obj).choose != undefined
}

export {
    isEffect,
    isEffectSelection,
    isEffectGroup
}

export type {
    Race,
    Subrace,
    Feature,
    LeveledFeature,
    EffectSelection,
    EffectGroup,
    Effect,
    Class,
    Subclass
}

