import { AbilityKeys, SkillKeys } from "./context/template"
const shortNameMapping: Record<AbilityKeys, string> = {
    str: "力", dex: "敏", con: "体",
    int: "智", wis: "感", cha: "魅",
}

const nameMapping: Record<AbilityKeys, string> = {
    str: "力量", dex: "敏捷", con: "体质",
    int: "智力", wis: "感知", cha: "魅力",
}

const skillMapping: Record<SkillKeys, string> = {
    acrobatics: "杂技", animal_handling: "驯兽", arcana: "奥秘", athletics: "运动",
    deception: "欺瞒", history: "历史", insight: "洞悉", intimidation: "威吓",
    investigation: "调查", medicine: "医药", nature: "自然", perception: "察觉",
    performance: "表演", persuasion: "说服", religion: "宗教", sleight_of_hand: "巧手",
    stealth: "隐匿", survival: "生存",
}

const proficiencyByLevel = function(level: number): number {
    if (level >= 17) return 6
    if (level >= 13) return 5
    if (level >= 9) return 4
    if (level >= 5) return 3
    return 2
}

export { shortNameMapping, nameMapping, skillMapping, proficiencyByLevel }