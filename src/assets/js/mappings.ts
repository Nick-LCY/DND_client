import { AbilityKeys, SkillKeys } from "./expression/dataType"

const shortNameMapping: Record<AbilityKeys, string> = {
    str: "力", dex: "敏", con: "体",
    int: "智", wis: "感", cha: "魅",
}

const nameMapping: Record<AbilityKeys, string> = {
    str: "力量", dex: "敏捷", con: "体质",
    int: "智力", wis: "感知", cha: "魅力",
}

const skillNameMapping: Record<SkillKeys, string> = {
    acrobatics: "杂技", animal_handling: "驯兽", arcana: "奥秘", athletics: "运动",
    deception: "欺瞒", history: "历史", insight: "洞悉", intimidation: "威吓",
    investigation: "调查", medicine: "医药", nature: "自然", perception: "察觉",
    performance: "表演", persuasion: "说服", religion: "宗教", sleight_of_hand: "巧手",
    stealth: "隐匿", survival: "生存",
}

const skillCategoryMapping: Record<SkillKeys, AbilityKeys> = {
    acrobatics: "dex", animal_handling: "wis", arcana: "int", athletics: "str",
    deception: "cha", history: "int", insight: "wis", intimidation: "cha",
    investigation: "int", medicine: "wis", nature: "int", perception: "wis",
    performance: "cha", persuasion: "cha", religion: "int", sleight_of_hand: "dex",
    stealth: "dex", survival: "wis",
}

export { shortNameMapping, nameMapping, skillNameMapping, skillCategoryMapping }