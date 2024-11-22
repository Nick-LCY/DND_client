import { ExpressionResult } from "./dataType"


// interface Character {
//     abilities: Record<AbilityKeys, number>
//     saves: Record<AbilityKeys, boolean>
//     skills: Record<SkillKeys, number>
// }


// interface CharacterStack {
//     abilities: Record<AbilityKeys, SourcedExpressionType[]>
//     saves: Record<AbilityKeys, SourcedExpressionType[]>
//     skills: Record<SkillKeys, SourcedExpressionType[]>
// }

const character: ExpressionResult = {
    abilities: {
        str: 8, dex: 8, con: 8,
        int: 8, wis: 8, cha: 8,
    },
    saves: {
        str: false, dex: false, con: false,
        int: false, wis: false, cha: false,
    },
    skills: {
        acrobatics: 0, animal_handling: 0, arcana: 0, athletics: 0,
        deception: 0, history: 0, insight: 0, intimidation: 0,
        investigation: 0, medicine: 0, nature: 0, perception: 0,
        performance: 0, persuasion: 0, religion: 0, sleight_of_hand: 0,
        stealth: 0, survival: 0,
    },
    class: {
        level: 0, main: "", sub: ""
    },
    spell_slots: {
        1: {current: 0, capacity: 0},
        2: {current: 0, capacity: 0},
        3: {current: 0, capacity: 0},
        4: {current: 0, capacity: 0},
        5: {current: 0, capacity: 0},
        6: {current: 0, capacity: 0},
        7: {current: 0, capacity: 0},
        8: {current: 0, capacity: 0},
        9: {current: 0, capacity: 0},
    }
}

export { character }