interface Abilities {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
}

// == 0 - no proficiency
// == 1 - half proficiency
// >= 2 - full proficiency
interface Skills {
    nature: number
}

interface Saves {
    str: boolean
    dex: boolean
    con: boolean
    int: boolean
    wis: boolean
    cha: boolean
}

class Character {
    abilities: Abilities = {
        str: 8, dex: 8, con: 8,
        int: 8, wis: 8, cha: 8,
    }
    skills: Skills = {
        nature: 0
    }
    saves: Saves = {
        str: false, dex: false, con: false,
        int: false, wis: false, cha: false,
    }
    darkvision: number = 0
    speed: number = 30

    reset() {
        this.abilities.str = 8
        this.saves.str = false
        this.abilities.dex = 8
        this.saves.dex = false
        this.abilities.con = 8
        this.saves.con = false
        this.abilities.int = 8
        this.saves.int = false
        this.abilities.wis = 8
        this.saves.wis = false
        this.abilities.cha = 8
        this.saves.cha = false
    }
}

export default Character