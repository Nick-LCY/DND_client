import { SourcedExpressionType } from "./dataType"

const _abilityKeys = ["str", "dex", "con", "int", "wis", "cha"] as const
type AbilityKeys = (typeof _abilityKeys)[number]

interface Character {
    abilities: Record<AbilityKeys, number>
    saves: Record<AbilityKeys, boolean>
}

interface CharacterStack {
    abilities: Record<AbilityKeys, SourcedExpressionType[]>
    saves: Record<AbilityKeys, SourcedExpressionType[]>
}

const character: Character = {
    abilities: {
        str: 8, dex: 8, con: 8,
        int: 8, wis: 8, cha: 8,
    },
    saves: {
        str: false, dex: false, con: false,
        int: false, wis: false, cha: false,
    }
}

export type { Character, CharacterStack }
export { character }