import { EffectGroup } from "./originalDataType"

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
    effects: EffectGroup
    // TODO: remove selection
    selection?: Selection
}

interface ConditionalFeature {
    condition: () => boolean
    id: string
    name: string
    description: string
    effects: EffectGroup
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