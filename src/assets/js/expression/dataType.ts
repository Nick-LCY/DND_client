import { Effect, Expression } from "../originalDataType"

const _abilityKeys = ["str", "dex", "con", "int", "wis", "cha"] as const
type AbilityKeys = (typeof _abilityKeys)[number]

const _skills = [
    "acrobatics", "animal_handling", "arcana", "athletics",
    "deception", "history", "insight", "intimidation",
    "investigation", "medicine", "nature", "perception",
    "performance", "persuasion", "religion", "sleight_of_hand",
    "stealth", "survival"
] as const
type SkillKeys = (typeof _skills)[number]

interface SourcedEffect {
    sources: string[]
    effect: Effect
}

interface SourcedExpression {
    sources: string[]
    expression: Expression
}

interface SourceRepresentation {
    sources: string[]
    result: string
}

interface ExpressionResult {
    [key: string]: ExpressionResult | boolean | string | number
}

interface ExpressionStack {
    [key: string]: ExpressionStack | SourcedExpression[]
}

interface ExpressionSource {
    [key: string]: ExpressionSource | SourceRepresentation[]
}

export type {
    SourcedEffect,
    SourcedExpression,
    SourceRepresentation,

    ExpressionResult,
    ExpressionSource,
    ExpressionStack,

    AbilityKeys,
    SkillKeys,
}