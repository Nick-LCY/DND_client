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
    selection?: Selection
}
interface Categories {
    [key: string]: { data: Array<Feature>, collapse: boolean }
}

export type {
    Categories,
    Feature,
    Selection,
    Option
}