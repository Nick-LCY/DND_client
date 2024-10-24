interface Effect {
    id: string
    name: string
    description: string
    expressions: string[]
}

interface EffectSelection {
    choose: number
    available: (
        | EffectSelection
        | Effect
    )[]
}

interface Feature {
    id: string
    name: string
    description: string
    category: string
    effects: (
        | EffectSelection
        | Effect
    )[] | EffectSelection
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

function isEffect(obj: Effect | EffectSelection): obj is Effect{
    return (<EffectSelection>obj).choose == undefined;
}

export {
    isEffect
}

export type {
    Race,
    Subrace,
    Feature,
    EffectSelection,
    Effect
}

