import { EffectGroup, EffectGroupDict } from "./originalDataType"

interface Option {
    id: string
    name: string
    description: string
}

interface Selection {
    choose: number
    available: Array<Option>
}
interface Feature {
    id: string
    name: string
    description: string
    effects: EffectGroup | EffectGroupDict
    sources: string[]
}

interface ConditionalFeature {
    condition: () => boolean
    id: string
    name: string
    description: string
    effects: EffectGroup | EffectGroupDict
    sources: string[]
}
interface Categories {
    [key: string]: Array<Feature | ConditionalFeature>
}

export type {
    Categories,
    Feature,
    ConditionalFeature,
    Selection,
    Option
}