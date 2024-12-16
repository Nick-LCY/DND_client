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

const categoryMapping: { [key: string]: string } = {
    race_traits: "种族特质",
    race_proficiencies: "种族熟练项",
    class_traits: "职业特质",
    class_level_traits: "职业等级特质",
    class_proficiencies: "职业熟练项",
    class_equipments: "职业初始装备",
    subclass_traits: "子职业特质",
    subclass_level_traits: "子职业等级特质",
    subclass_proficiencies: "子职业熟练项",
    subrace_traits: "亚种特质",
    subrace_proficiencies: "亚种熟练项",
    background_traits: "背景特质",
    background_proficiencies: "背景熟练项",
    background_equipment: "背景初始装备",
}

export {
    shortNameMapping,
    nameMapping,
    skillNameMapping,
    skillCategoryMapping,
    categoryMapping
}