import { AbilityKeys } from "./context/template"
const shortNameMapping: Record<AbilityKeys, string> = {
    str: "力", dex: "敏", con: "体",
    int: "智", wis: "感", cha: "魅",
}

const nameMapping: Record<AbilityKeys, string> = {
    str: "力量", dex: "敏捷", con: "体质",
    int: "智力", wis: "感知", cha: "魅力",
}

export { shortNameMapping, nameMapping }