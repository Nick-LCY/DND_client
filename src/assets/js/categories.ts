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
    [key: string]: Array<Feature>
}

export type {
    Categories,
    Feature,
    Selection,
    Option
}