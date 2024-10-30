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
interface Categories {
    [key: string]: Array<Feature>
}

export type {
    Categories,
    Feature,
    Selection,
    Option
}